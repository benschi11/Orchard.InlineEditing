﻿(function ($, window) {
    "use strict";

    $("body").on("click", "a.edit-shape", function (e) {
        e.preventDefault();

        var self = $(this);
        var editUrl = $(this).attr("href");

        $.ajax({ cache: false, url: editUrl }).then(function (data) {
            ui.initializeEditor(data, self);
        });

        return false;
    });

    var ui = {
        events: {
            initializingEditor: 'inlineedit.initializingEditor',
            initializedEditor: 'inlineedit.initializedEditor',
            editorPreparing: 'inlineedit.editorPreparing',
            editorPrepared: 'inlineedit.editorPrepared',
            onSaving: 'inlineedit.onSaving',
            retrieveContent: 'inlineedit.retrieveContent',
            onSaved: 'inlineedit.onSaved',
            onCancelling: 'inlineedit.onCancelling',
            onCancelled: 'inlineedit.onCancelled',
            
            notifyEditorChanged: "inlineedit.notifyEditorChanged"
        },

        initializeEditor: function (data, shape) {
            console.log("initializing the editor");

            var $ui = $(this);
            $ui.trigger(ui.events.initializingEditor, [this, shape, data]);
            
            var wrapper = shape.parents(".widget-control:first");
            var shapeEditor = $(".shape-editor", wrapper);
            
            var shapeContent = shape.parents(".shape-content:first");

            $ui.trigger(ui.events.editorPreparing, [this, shape, data]);

            // Strip JS files that already exist on page.
            $(data).find("script[type='text/javascript']").each(function (index) {
                var sourceValue = $(this).attr('src');

                var bodyScript = $("script[src='" + sourceValue + "']");

                if (bodyScript.length == 0) {
                    $('body').append(this);
                }
                
                data = $(data).clone().find("script[src='" + sourceValue + "']").remove().end();
            });

            $(data).find("link[type='text/css']").each(function (index) {
                var sourceValue = $(this).attr('href');

                var bodyScript = $("link[href='" + sourceValue + "']");

                if (bodyScript.length == 0) {
                    $('head').append(this);
                }

                data = $(data).clone().find("link[href='" + sourceValue + "']").remove().end();
            });

            data = $(data).clone().find("noscript,style").remove().end();

            shapeEditor.html(data);

            shapeContent.hide(0, function () {
                shapeEditor.show(0, function () {
                    $ui.trigger(ui.events.editorPrepared, [this, shape, data]);
                });
            });

            $("a[data-command='cancel']", shapeEditor).one("click", function (event) {
                event.preventDefault();
                
                // Want to do something to the shape before its cancelled?
                $ui.trigger(ui.events.onCancelling, [this, shapeEditor]);

                shapeEditor.hide(0, function () {
                    shapeContent.show(0, function () {
                        shapeEditor.empty();
                    });
                });

                $ui.trigger(ui.events.onCancelled, [this, shapeEditor]);

                return false;
            });

            $("a.submit", shapeEditor).one("click", function (event) {
                event.preventDefault();
                
                // This trig will get the text that we are going to save.....
                $ui.trigger(ui.events.onSaving, [this, shapeEditor]);
                
                $ui.triggerHandler(ui.events.retrieveContent, [this, shapeEditor]);

                var $form = $(this).parents("form:first"),
                    urlAction = $form.attr('action');
                    //antiforgerytoken = $form.find('input[name=__RequestVerificationToken]').val();
                
                var content = $form.serialize();

                $.post(urlAction, content )
                    .done(function (html) {

                        var shapeId = $(html.trim()).data("shape-id");
                        var shapeType = $(html.trim()).data("shape-type");
                        var shapeName = $(html.trim()).data("shape-name");
                        if (shapeName == undefined) {
                            $("[data-shape-id=" + shapeId + "][data-shape-type=" + shapeType + "]").replaceWith(function() {
                                return html.trim();
                            });
                        } else {
                            $("[data-shape-id=" + shapeId + "][data-shape-type=" + shapeType + "][data-shape-name=" + shapeName + "]").replaceWith(function () {
                                return html.trim();
                            });
                        }
                        // TODO: markup for new display shape
                        shapeEditor.hide(0, function () {
                            shapeContent.show(0, function () {
                                shapeEditor.empty();
                            });
                        });
                    })
                    .fail(function (error) { alert("error"); });

                $ui.trigger(ui.events.onSaved, [this, shapeEditor]);
                
                return false;
            });
            
            $ui.trigger(ui.events.initializedEditor, [this, shape, data]);
            console.log("Editor Initialized");
        }
    };
    
    if (!window.orchard) {
        window.orchard = {};
    }

    if (!window.orchard.inlineedit) {
        window.orchard.inlineedit = {};
    }

    window.orchard.inlineedit.ui = ui;
})(jQuery, window);