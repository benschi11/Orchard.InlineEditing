(function ($, window, inlineedit, tinymce) {
    "use strict";


    var $inlineedit = $(inlineedit);
    console.log("here");
    $inlineedit.bind(inlineedit.events.retrieveContent, function (event, scope, shapeEditor) {
        console.log('Processing Content: TinyMce Editor');

        if (tinyMCE != undefined) {
            console.log('Processing Content: TinyMce Editor triggering save');

            var editorFieldId = $(shapeEditor).find(".tinymce").attr("id");
            var activeEditor = tinyMCE.get(editorFieldId);
            if (activeEditor.isDirty()) {
                var afterContent = activeEditor.getContent({ format: 'text' });
                var fieldId = $('#' + activeEditor.id).attr("data-fieldId");

                $('#' + fieldId).val(afterContent);
            }

            console.log('Processing Content: TinyMce Editor triggering saved');
        }

        console.log('Processed Content: TinyMce Editor');
    });
    console.log("here");
    $inlineedit.bind(inlineedit.events.editorPrepared, function (event, shape, shapeEditor) {
        console.log('Finalizing Editor');

        var selector = '#' + shape.id + ' div.tinymce';

        var editorShapeId = $(selector).attr('id');
        var newEditorShapeId = shape.id + '_' + editorShapeId;
        $(selector).attr('id', newEditorShapeId);

        console.log(newEditorShapeId);


        tinyMCE.init({
            selector: '#' + newEditorShapeId,
            theme: 'modern',
            schema: 'html5',
            plugins: "paste",
            toolbar: 'undo redo',
            convert_urls: false,
            entity_encoding: "raw",
            valid_elements: '*[*]',
            // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
            extended_valid_elements: 'script[type|defer|src|language]',
            menubar: false,
            statusbar: false,
            skin: 'orchardlightgray',
            inline: true
        });
        console.log('Finalized Editor');
    });

    $inlineedit.bind(inlineedit.events.onCancelling, function (event, shape, shapeEditor) {

        var editorFieldId = $(shapeEditor).find(".tinymce").attr("id");
        tinymce.get(editorFieldId).remove();


    });

    var editor = {

    };

    if (!window.orchard) {
        window.orchard = {};
    }

    if (!window.orchard.inlineedit) {
        window.orchard.inlineedit = {};
    }

    if (!window.orchard.inlineedit) {
        window.orchard.inlineedit.ui = {};
    }

    window.orchard.inlineedit.defaulteditor = editor;
})(jQuery, window, window.orchard.inlineedit.ui, window.tinymce);