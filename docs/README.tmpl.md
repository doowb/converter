# {%= name %} {%= _.badge("fury") %} {%= _.badge("travis") %}

> {%= description %}

## Getting Started
{%= _.doc("quickstart.md") %}

## Options
{%= _.doc("options.md") %}

## Contributing
{%= _.contrib("contributing.md") %}

## Author
{%= _.contrib("authors.md") %}

## Related
+ [helpers](https://github.com/helpers): some great handlebars helpers that we decided not to include in the [handlebars-helpers](https://github.com/assemble/handlebars-helpers) project, most likely because the code footprint was too big or the helper wasn't generic enough.
{%= _.include("relate-repos-list.md") %}

## License
{%= copyright %}
{%= license %}

***

{%= _.include("footer.md") %}