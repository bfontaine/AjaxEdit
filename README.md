AjaxEdit
========

*AjaxEdit* is a lightweight jQuery plugin written for [IP7’s
website](https://github.com/IP7/Website), to edit some HTML sections using
Markdown.

This is currently under development.


How it works
------------

This plugin makes AJAX calls to an URL to get/post the content. It works basically
this way:

1. The user want to edit an HTML region
2. *AjaxEdit* get the content from your API, in Markdown
3. The user edit the Markdown, and save
4. *AjaxEdit* post the content to your API, and get the compiled HTML back

Example of JSON content returned by your API:

```json
{
    "title" : {
        "html" : "Foo <b>bar</b>",
        "text" : "Foo **bar**"
    },

    "intro" : {
        "html" : "Lorem <a href='#'>ipsum</a>",
        "text" : "Lorem [ipsum](#)"
    }
}
```


Usage
-----

Include `jquery.ajaxedit.js` in your page, *after* jQuery. Then use the
`.ajaxedit(options)` method. It takes one argument, either a string or an
object. You <u>must</u> provide a local URL (same domain) which will be
used as an API endpoint to get/post the content. It will throw an `Error` if no
URL is provided. You can provide it either as a string or in an object:

```js
// using a string
$( '#example' ).ajaxedit( '/api/example.json' );

// using an object
$( '#example' ).ajaxedit({

    url: '/api/example.json'

});
```

Events
------

Different events are triggered by the plugin:

1. When an element is ready to be edited: `EditReady`
2. When the user try to edit an element: `EditInit`
3. If the call to the API works: `EditOk`
4. If there is an error: `EditError`
5. When the user saves their change: `EditEnd`
6. If the user cancel the edit: `EditCanceled`
7. If the save failed: `EditSaveError`
8. Otherwise: `EditSaveOk`
