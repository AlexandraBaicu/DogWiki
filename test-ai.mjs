async function test() {
  const res = await fetch('https://text.pollinations.ai/prompt/Spune-mi%20pe%20scurt%20ceva%20despre%20pug?system=Raspunde%20scurt%20in%20romana');
  const text = await res.text();
  console.log(text);
}
test();
