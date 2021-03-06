﻿(function ($, window, inlineedit, tinymce) {
    "use strict";

    var $inlineedit = $(inlineedit);

    $inlineedit.bind(inlineedit.events.retrieveContent, function (event, scope, shapeEditor) {
        console.log('Processing Content: TinyMce Editor');

        if (tinyMCE != undefined) {
            console.log('Processing Content: TinyMce Editor triggering save');
            var editorFieldId = $(shapeEditor).find(".tinymce").attr("id");
            var activeEditor = tinyMCE.get(editorFieldId);
            if (activeEditor.isDirty()) {
                var afterContent = activeEditor.save();
                $('#' + activeEditor.id).parent('form').children('textarea').val(afterContent);
            }

            console.log('Processing Content: TinyMce Editor triggering saved');
        }

        console.log('Processed Content: TinyMce Editor');
    });

    $inlineedit.bind(inlineedit.events.editorPrepared, function (event, shape, shapeEditor) {
        console.log('Finalizing Editor');

        var mediaPlugins = ',|';


        if (mediaLibraryEnabled) {
            mediaPlugins += ",medialibrary";
        }

        //if (shapeEditor.MetadataType == 'Parts_Common_Body') {
        var selector = '#' + shape.id + ' div.tinymce';

        var editorShapeId = $(selector).attr('id');
        var newEditorShapeId = shape.id + '_' + editorShapeId;
        $(selector).attr('id', newEditorShapeId);

        tinyMCE.init({
            selector: '#' + newEditorShapeId,
            theme: 'modern',
            schema: 'html5',
            plugins: 'fullscreen,autoresize,searchreplace,link,charmap,code' + mediaPlugins.substr(2),
            toolbar: 'searchreplace,|,cut,copy,paste,|,undo,redo' + mediaPlugins + ',|,link,unlink,charmap,|,bold,italic,|,numlist,bullist,formatselect,|,code,fullscreen,',
            convert_urls: false,
            valid_elements: '*[*]',
            // shouldn't be needed due to the valid_elements setting, but TinyMCE would strip script.src without it.
            extended_valid_elements: 'script[type|defer|src|language]',
            menubar: false,
            statusbar: false,
            skin: 'orchardlightgray',
            inline: true
        });
        //}

        console.log('Finalized Editor');
    });


    $inlineedit.bind(inlineedit.events.onCancelling, function (event, shape, shapeEditor) {
        removeEditor(shape, shapeEditor);

    });

    $inlineedit.bind(inlineedit.events.onSaved, function (event, shape, shapeEditor) {
        removeEditor(shape, shapeEditor);
    });

    var removeEditor = function (shape, shapeEditor) {
        var editorFieldId = $(shapeEditor).find(".tinymce").attr("id");
        console.log("Try to remove TinyMce from Field with ID: " + editorFieldId);
        tinyMCE.get(editorFieldId).remove();
    };

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