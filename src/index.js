import "./styles.css";
import no from "@knuijver/no-self-control";

const app = document.getElementById("app");

const cssLines = [
  ".text-title { font-weight: 600; border: solid 1px #ccc; padding: 15px; line-height: 1em; }",
  ".text-title h2 { margin: 0; }"
];

app.insertAdjacentElement(
  "beforebegin",
  document
    .createElement("style")
    .appendChild(document.createTextNode(cssLines.join("\r\n"))).parentElement
);

const add = (a, ...b) => (b ? b.reduce((x, y) => x + y, a) : a);

/** Example 1 - plain javascript to add elements */
app.appendChild(
  document
    .createElement("div")
    .appendChild(
      document
        .createElement("h2")
        .appendChild(document.createTextNode("Example 1")).parentElement
    )
    .parentElement.appendChild(
      [...Array.from({ length: 5 }).map((_, x) => `item ${add(1, x)}`)].reduce(
        (elm, x) =>
          elm.appendChild(
            document.createElement("li").appendChild(document.createTextNode(x))
              .parentElement
          ).parentElement,
        document.createElement("ul")
      )
    ).parentElement
);

/** Example 2 - use helper functions to shorten the syntax */
const h = (name, props) => Object.assign(document.createElement(name), props);
const t = (text) => document.createTextNode(text);
const append = (elm, child) => elm.appendChild(child);
const insert = (elm, child) => append(elm, child).parentElement;

append(
  app,
  insert(h("div", { style: "color: red" }), insert(h("h2"), t("Example 2")))
);

/**
 * Example 3 - custom element functions to improve syntax
 * This is most simmular tor how React would look without JSX
 */
const div = (props, children) =>
  Object.assign(h("div"), props).appendChild(children).parentElement;

append(
  app,
  div(
    { style: "color: orange", className: "text-title" },
    insert(h("h2"), t("Example 3"))
  )
);

/** Example 4 - write generic functions to display elements using datastructures or ast (lisp like) syntax */
function createPage(elm, m) {
  const [tag, props, children] = m;
  if (Array.isArray(tag)) {
    return m.map((x) => createPage(elm, x));
  } else {
    const node =
      tag === null
        ? Object.assign(t(children), props)
        : Object.assign(h(tag), props);

    elm.append(node);

    if (Array.isArray(children)) {
      return createPage(node, children);
    }
  }

  return elm;
}

const text = (t) => [null, null, t];
const page = [
  "div",
  { style: "color: red; border: solid 1px; margin-top: 5px;" },
  [
    [
      "h1",
      { style: "padding: 10px;", class: "text-title" },
      text("Sample 4.1")
    ],
    ["h2", { style: "padding: 10px; color: green" }, text("Sample 4.2")],
    ["h3", { style: "padding: 10px; color: blue" }, text("Sample 4.3")]
  ]
];

createPage(app, page);

/** Example 5 - based on the above, we can implement a headless api */
fetch("public/ui.json")
  .then((r) => r.json())
  .then((json) => createPage(app, json));
