// GLOBAL SELECTORS:
let container = document.querySelectorAll(".input-container");
let form = document.querySelector("form");
let checkbox = document.querySelector(".checkbox");
let tickMarkPath = document.querySelector(".tick-mark path");

// PATH ATTRIBUTE WITHIN LINE SVG ELEMENT:
let start =
  "M0 0.999512C0 0.999512 60.5 0.999512 150 0.999512C239.5 0.999512 300 0.999512 300 0.999512";
let end =
  "M1 0.999512C1 0.999512 61.5 7.5 151 7.5C240.5 7.5 301 0.999512 301 0.999512";

/* 
  ! NOTES:
  Our svg elements can be modified using attributes that specify details - 
  about exactly how the element should be handled or rendered.
  * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute

  The `d` attribute defines a path to be drawn.
  A path definition is a list of path commands where each command composes -
  of a command letter and number, that represent the command parameters.

  Use `d` with `svg` elements that have a <path>, <glyph>, <missing-glyph>.
  The `d` is a presentation attribute and hence can be used as a css property.

  Then we can animate "change" attributes in gsap with the `attr` plugin.
  * http://greensock.com/docs/#/HTML5/Plugins/AttrPlugin/
*/

// LINE AND PLACEHOLDER ANIMATIONS:
container.forEach((container) => {
  let input = container.querySelector(".input");
  let line = container.querySelector(".elastic-line");
  let placeholder = container.querySelector(".placeholder");
  let tl = gsap.timeline({ defaults: { duration: 1 } });

  input.addEventListener("focus", () => {
    // check to see if there is any text in the `<input>`.
    if (!input.value) {
      tl.fromTo(
        line,
        { attr: { d: start } },
        { attr: { d: end }, ease: "power2.easeOut", duration: 0.75 }
      );
      tl.to(line, { attr: { d: start }, ease: "elastic.out(3, 0.5)" }, "<50%");
      tl.to(
        placeholder,
        {
          top: -15,
          left: 0,
          scale: 0.7,
          duration: 0.5,
          ease: "power2.easeOut",
        },
        "<15%"
      );
    }
  });
});

// HERE WE REVERT BACK ABOVE CHANGES:
form.addEventListener("click", () => {
  container.forEach((container) => {
    let input = container.querySelector(".input");
    let line = container.querySelector(".elastic-line");
    let placeholder = container.querySelector(".placeholder");
    // Check if active element is `!` NOT the current `input` in our iteration.
    // Additionally if there is no value in the element then revert changes.
    if (document.activeElement !== input) {
      if (!input.value) {
        gsap.to(placeholder, {
          top: 0,
          left: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.easeOut",
        });
      }
    }
    // AND HAVE INPUT CHECKING LOGIC:
    input.addEventListener("input", (e) => {
      if (e.target.type === "text") {
        let inputText = e.target.value;
        if (inputText.length > 2) {
          colorize("#6391E8", line, placeholder);
        } else {
          colorize("#FE8C99", line, placeholder);
        }
      }
      if (e.target.type === "email") {
        let valid = validateEmail(e.target.value);
        if (valid) {
          colorize("#6391E8", line, placeholder);
        } else {
          colorize("#FE8C99", line, placeholder);
        }
      }
      if (e.target.type === "tel") {
        let valid = validatePhone(e.target.value);
        if (valid) {
          colorize("#6391E8", line, placeholder);
        } else {
          colorize("#FE8C99", line, placeholder);
        }
      }
    });
  });
});

// CHECKING EMAIL VALIDATION:
function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function validatePhone(phone) {
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone);
}

// COLOR FUNCTION
function colorize(color, line, placeholder) {
  gsap.to(line, { stroke: color, duration: 0.75 });
  gsap.to(placeholder, { color: color, duration: 0.75 });
}

// CHECKBOX ANIMATIONS:
checkbox.addEventListener("click", () => {
  // Here we use a svg element's `getTotalLength()` method to return the user -
  // agent's computed value for the total length of the path in user units.
  let pathLength = tickMarkPath.getTotalLength();
  let tl = gsap.timeline({
    defaults: { duration: 0.5, ease: "power2.easeOut" },
  });
  gsap.set(tickMarkPath, {
    // The `stroke-dashoffset` attribute is a presentation attribute defining an -
    // offset on the rendering of the associated dash array.
    strokeDashoffset: pathLength,
    // The `stroke-dasharray` attribute is a presentation attribute defining the -
    // pattern of dashes and gaps used to paint the outline of the shape.
    strokeDasharray: pathLength,
  });
  if (checkbox.checked) {
    tl.to(".checkbox-filler", { top: "0%" });
    tl.fromTo(
      tickMarkPath,
      { strokeDashoffset: pathLength },
      { strokeDashoffset: 0 },
      "<50%"
    );
    tl.to(".checkbox-label", { color: "#6391e8" }, "<");
  } else {
    tl.to(".checkbox-filler", { top: "100%" });
    tl.fromTo(
      tickMarkPath,
      { strokeDashoffset: 0 },
      { strokeDashoffset: pathLength },
      "<50%"
    );
    tl.to(".checkbox-label", { color: "#c5c5c5" }, "<");
  }
});

// ANIMATING CHARACTER:
gsap.set("#eye", { transformOrigin: "center" });
gsap.fromTo(
  "#eye",
  { scaleY: 1 },
  {
    scaleY: 0.3,
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.5,
    ease: "power2.easeOut",
  }
);
gsap.fromTo(
  "#eyebrow",
  { y: -1 },
  { y: 0, yoyo: true, repeat: -1, repeatDelay: 0.5, ease: "power2.easeOut" }
);

let button = document.querySelector("button");
button.addEventListener("click", (e) => {
  e.preventDefault();
  let tl = gsap.timeline({
    defaults: { duration: 0.75, ease: "power2.easeOut" },
  });
  tl.to(".contact-right, .contact-left", {
    y: 30,
    opacity: 0,
    pointerEvents: "none",
  });
  tl.to("form", { scale: 0.8 }, "<");
  tl.fromTo(".submitted", { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, "<");
  gsap.set("#hand", { transformOrigin: "left" });
  tl.fromTo(
    "#hand",
    { rotation: 0 },
    { rotation: 5, repeat: 10, yoyo: true, delay: 1 },
    "<"
  );
});
