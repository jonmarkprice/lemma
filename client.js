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
const token = Vue.component("token", {
  props: ["expr"],
  template: `
  <div class="token">
    <div v-if="expr.length == 1" class="symbol">
      {{ expr[0] }}
    </div>
    <div v-else class="symbol">
      <span v-for="subexpr in expr">
        {{ subexpr }}
      </span>
    </div>
    <div class="highlight"></div>
  </div>
  `,
});

/* TODO: Make recursive to work for abitrary nesting
NOTE: Can do in a render function
const symList = Vue.component("symList", {
  props: ["syms"],
  template: `
    <span class="sym-list">
      <span v-for
    </span>
  `
});
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
    tokens: 9, // this will vary with the arity of the transformation
    x: 0,
    y: 0,
    message: null, //{type: "", text: ""} // type in {error, ok, admin, ...}
    history: [], // history of indicies to highlight [or integrate into steps], also may list rules
    steps: [[["~", "a"], ["+"], ["~", "b"]]],
    select: {},
  },
  created() {
    window.addEventListener("keyup", event => {
      switch (event.key) {
        case "ArrowUp"    : return this.up();
        case "ArrowDown"  : return this.down();
        case "ArrowLeft"  : return this.left();
        case "ArrowRight" : return this.right();
        case " "          : return this.space();
        case "Escape"     : return this.esc();
      }
    });
  },
  methods: {
    isSelected(index) {
      if ("right" in this.select) {      
        return (index >= this.select.left && index <= this.select.right);
      } else {
        return (index == this.select.left);
      } 
    },
    esc() {
      console.log("ESC");
      this.select = {};
    },
    space() {
      console.log("-- SPACE --");
      this.select = {left: this.x};
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
      }
      // No wrap for now as may cause bugs with selection
      if (this.x >= this.select.left) {
        this.select.right = this.x;
      }
    },
    right() {
      if (this.x + 1 < this.tokens) {
        this.x++;
      }
      this.select.right = this.x;
    },
  },
  provide: {
    /* TODO: It would be very nice to be able to select both left and right of
       the starting cursor. */
  }
});
