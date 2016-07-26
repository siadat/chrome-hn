# HN commands

Use Chrome omnibox to run **grep**, **limit**, **depth**, and **user** commands on HN comments.

![Screenshot](https://github.com/siadat/chrome-hn/raw/screenshots/chrome-hn-screenshot.png)

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

Display only 1 reply of each comment

    hn limit 1

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

Use [this console script](https://news.ycombinator.com/item?id=10313519) for filtering comments, if you don't have Chrome.

If you like this extension, you might also like these omnibox extensions for Chrome:

* **[chrome-ff](https://github.com/siadat/chrome-ff)**: Fuzzy finder for tabs and windows
* **[chrome-godoc](https://github.com/siadat/chrome-godoc)**: Go docs finder for packages, func, and types

## Contributing

- [Suggest a new command](https://github.com/siadat/chrome-hn/issues/new)
- [Report a problem](https://github.com/siadat/chrome-hn/issues/new)
- Pull requests are welcome!

## License

This extension is released under the [MIT License](http://www.opensource.org/licenses/MIT).
