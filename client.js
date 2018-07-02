// Try for starters to do keyboard movement.
/*
  First of a vertical list.
  Then of a separate horizontal list.

  Definitely both.
  Then press space or enter. Not sure if other "settings" or keys would be
  needed... I think just those.

  Now, for the parser. It will be handled as a separate model which will take
  an arbitrary formula as a string, and parse it into same JSON structure.

  I think the following would serve:

  formula ::= [...token]
  token ::= {id: "", children: [...token], data:{}}

  In this case, we would be given a syntax tree. So a string "a * b + c" would
  be given as:
  [
    {+: [
      {*: [a, b]},
      c},
    ]},
  ] (in shorthand...)

This could easily be encoding in JSON and thus passed by a server side program
if needed.

Thus our Vue parser would be able to match whether a pattern "fit".
It must also be able to display, and highlight a syntax tree.

Initially, we could write everything in such a syntax tree. But later versions
would want to parse strings.

No click controls at all. Those can be added later, but this must be seen as
a GAME.
*/
const app = new Vue({
  el: "#page",
  data: {
    laws: [
      // Each of these could basically be used as "left" or "right"
      "nA + mA = (n + m)A", // special case of associativity
      "1 * A = A",
      "AB = A * B",
      "A + B = B + A",
      "A * B + B * A",
    ],
    tokens: 3, // this will vary with the arity of the transformation
    x: 0,
    y: 0,
    message: null, //{type: "", text: ""} // type in {error, ok, admin, ...}
    history: [], // history of indicies to highlight [or integrate into steps], also may list rules
    steps: [["a", "+", "a"]],
  },
  created() {
    window.addEventListener("keyup", event => {
      switch (event.key) {
        case "ArrowUp"    : return this.up();
        case "ArrowDown"  : return this.down();
        case "ArrowLeft"  : return this.left();
        case "ArrowRight" : return this.right();
        case " "          : return this.space();
      }
    });
  },
  methods: {
    space() {
      console.log("-- SPACE --")
    },
    up() {
      if (this.y > 0) {
        this.y--;
      } else {
        this.y = this.laws.length - 1; // wrap around
      }
    },
    down() {
      if (this.y + 1 < this.laws.length) {
        this.y++;
      } else {
        this.y = 0; // wrap around
      }
    },
    left() {
      if (this.x > 0) {
        this.x--;
      } else {
        this.x = this.tokens - 1; // wrap around
      }
    },
    right() {
      if (this.x + 1 < this.tokens) {
        this.x++;
      } else {
        this.x = 0; // wrap around
      }
    },
  }
});
