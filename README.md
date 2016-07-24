# HN commands

Use Chrome omnibox to run `grep`, `user` and `depth` commands on HN comments.
It is pretty fast.

## Usage

Type these in the Chrome omnibox (addressbar):

    hn grep [-v] [REGEX]
    hn user [-v] [USERNAME]
    hn depth [NUMBER]
    hn limit [NUMBER]
    hn reset
    hn open
    hn focus

## Example

Display root comments only

    hn depth 1

Display comments that have "react" and "ios"

    hn grep react ios

Hide messages containing react

    hn grep -v react

Display comments by pg

    hn user pg

Reset filters

    hn reset

## Similar tools

Use [this console script](https://news.ycombinator.com/item?id=10313519) instead, if you don't have Chrome.

If you like this extension, you might also like [chrome-ff](https://github.com/siadat/chrome-ff) and [chrome-godoc](https://github.com/siadat/chrome-godoc).

## Contributing

- [Suggest a new command](https://github.com/siadat/chrome-hn/issues/new)
- [Report a problem](https://github.com/siadat/chrome-hn/issues/new)
- Pull requests are welcome!

## License

This extension is released under the [MIT License](http://www.opensource.org/licenses/MIT).
