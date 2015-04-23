/*
 *  lSpace
 *  Justifying letters across the full width of the parent element
 *
 *  Tom Turton
 *  tomturton.co.uk
 *  Under MIT License
 */

;(function ($, window, document, undefined) {

    'use strict';

    // Create the defaults once
    var
        pluginName = "lspace",

        defaults   = {
        },

        Plugin = function (element, options) {
            this.element   = element;
            this.$element  = $(element);
            this.settings  = $.extend({}, defaults, options);
            this._defaults = defaults;
            this._name     = pluginName;
            this.init();
        },

        divide = function (nodes, isMultiline) {
            var numNodes = nodes.length,
                htmlArr  = [];

            for (var i = 0; i < numNodes; i+=1) {
                var
                    node  = nodes[i],
                    $node = $(node);

                //console.log(node);

                switch (node.nodeType) {
                    case 1: // element
                        var contents   = $node.contents(),
                            tagName    = node.tagName,
                            attributes = node.attributes,
                            openTag    = '<' + tagName + '>',
                            closeTag   = '</' + tagName + '>';

                        // Reconstruct HTML tags for this element
                        if (attributes.length) {
                            var tag = '<' + tagName + ' ',
                                numAttributes = attributes.length,
                                attrs = [];

                            for (var j = 0; j < numAttributes; j+=1) {
                                attrs[attrs.length] = attributes[j].nodeName + '="' + attributes[j].nodeValue + '"';
                            }
                        }

                        //console.log(tagName, contents);

                        // Divide element into nodes
                        if (contents.length) {
                            htmlArr[htmlArr.length] = openTag + divide(contents, isMultiline) + closeTag;
                        } else {
                            htmlArr[htmlArr.length] = '<span class="lspace-letter">' + openTag + '</span>';
                        }
                        break;


                    case 3: // text
                        var chars = $node.text();

                        // Trim string
                        if (i === 0) {
                            // First node, so left trim
                            chars = chars.replace(/^\s+/, '');
                        }
                        if (i === numNodes - 1) {
                            // Last node, so right trim
                            chars = chars.replace(/\s+$/, '');
                        }

                        // All remaining whitespace must be reduced to one space
                        chars = chars.replace(/\s+/g, ' ');
                        

                        var numChars = chars.length;

                        // Wrap each letter in a span we can style
                        for (var c = 0; c < numChars; c+=1) {
                            var character = chars[c];

                            if (character === ' ') {
                                character = '&nbsp;';
                            }

                            htmlArr[htmlArr.length] = '<span class="lspace-letter">' + character + '</span>';
                        }
                        
                        break;
                }
            }

            return htmlArr.join(' '); // there must be whitespace for text-align: justify to work!
        };


    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            this.getCurrentStyles();
            this.setup();
        },

        getCurrentStyles: function () {
            this.fontSize = this.$element.css('font-size');
        },

        setup: function () {
            var
                $container = this.$element,
                nodes      = $container.contents();

            //console.log(nodes);

            $container.addClass('lspace-container');
            $container.html(divide(nodes, !!this.settings.multiline));
            $('.lspace-letter', $container).css('font-size', this.fontSize);
        },

        
        destroy: function () {

        }
    });


    // Wrapper
    $.fn[pluginName] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
