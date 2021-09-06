export function generateCode() {
  let code = Array(6);
  for (let i = 0; i < code.length; i++) {
    code[i] = Math.floor(Math.random() * 9);
  }
  console.log(code);

  return code.join("");
}
