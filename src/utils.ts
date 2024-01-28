import { configure } from "highlightjs"
import config from "./config"

type Ref<T> = [T]
type Seq = string[] | string
type Rank = number

type PatString = { "pat_type": "string", "value": string }
type PatBlock = { "pat_type": "block", parts: Pattern[] }
type PatAny = { "pat_type": "any" }
type Pattern = PatString
             | PatBlock
             | PatAny

export type {
  Ref,
  Seq,
  Rank,
  PatString,
  PatBlock,
  PatAny,
  Pattern,
}

const compare = (value: Seq, target: Seq): Rank => {
  let i = 0, j = 0;
  let rank = 0;
  let jumped = 0;
  let score = 0;
  
  while (i < value.length && j < target.length) {
    const ss = value[i++];
    const ts = target[j];
    if (ts === "?") {
        ++j;
        rank += ++score;
    } else if (ss.indexOf(ts) === -1) {
        ++jumped;
        score = 0;
    } else {
        ++j;
        rank += ++score;
    }
  }
  if (j !== target.length || j === jumped) {
    return 0;
  }
  if (i === value.length && jumped === 0) {
    rank += 99;
  }
  return rank;
}

const parse_pat = (input: string, i: Ref<number> = [0]): Pattern => {
  if (input[i[0]] === "(") { ++i[0]; }
  const parts: Pattern[] = [{ pat_type: "string", value: "" }];
  for (; i[0] < input.length && input[i[0]] !== ")"; ++i[0]) {
      if (input[i[0]] === " ") {
          parts.push({ pat_type: "string", value: "" });
      } else if (input[i[0]] === "(") {
          parts.push(parse_pat(input, i))
          parts.push({ pat_type: "string", value: "" });
      } else if (input[i[0]] === "?") {
          parts.push({ pat_type: "any" })
          parts.push({ pat_type: "string", value: "" });
      } else if ((parts[parts.length - 1] as PatString).value) {
          (parts[parts.length - 1] as PatString).value += input[i[0]];
      }
  }
  const nonempty_parts = parts.filter(x => (x as PatString).value !== "");
  if (nonempty_parts.length === 1) {
      return nonempty_parts[0];
  }
  return {
      pat_type: "block",
      parts: nonempty_parts,
  }
}

const match_pat = (block: BlockSvg, pat: Pattern) => {
  if (!block) { return 0; }
  if (pat.pat_type === "any") { return 1; }
  if (pat.pat_type === "string") {
      let content = "";
      if (typeof(block) === "string") { content = block; }
      if (block?.inputList
       && block.inputList[0]?.fieldRow
       && block.inputList[0].fieldRow[0]?.text_) {
          content = block.inputList[0].fieldRow[0].text_.toString();
      }
      return compare(content, pat.value);
  }
  if (pat.pat_type === "block") {
      if (block.type === "data_variable" || block.type === "data_listcontents") {
          return match_pat(block.inputList[0].fieldRow[0].text_, pat);
      }
      if (pat.parts.length === 0) { return 0; }
      let rank = 0;
      const blt_ismatch = match_pat(block.type, pat.parts[0]);
      if (!blt_ismatch) { return 0; }
      rank = Math.max(blt_ismatch, rank);
      for (let i = 1, j = 1; i < pat.parts.length; ++j, ++i) {
          let blin;
          if (!(blin = block.childBlocks_[block.childBlocks_.length - j])) { return 0; }
          const blin_ismatch = match_pat(blin, pat.parts[i]);
          if (!blin_ismatch) { --i; continue; }
          rank = Math.max(blin_ismatch, rank);
      }
      return rank;
  }
  return 0;
}

const match_str = (block: BlockSvg, pat_string: string) => {
  if (!config.is_block_string_search_enabled) { return 0; }
  return compare(block.toString(), pat_string);
}

export {
  compare,
  parse_pat,
  match_pat,
  match_str,
}