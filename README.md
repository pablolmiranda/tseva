## Eva Language implementation in TypeScript

This a interpreter exercise to implement the Eva language using the TypeScript language. The goal is to create a consistent set of types to enable the correct implementation of the language.

### Language examples

The language is close to LISP but accepts a functional and imperative approach.

```eva
// Simple expressions
1                       // 1
10                      // 10
(+ 5 10)                // 15
(+ (- 10 3) (* 4 2))    // 15
"Hello"                 // Hello
(print "Hello")         // show Hello
```
