$(function() {
    var translations;
    translations = function() {
        var toggleTab, updateLocaleButtonsStatus;
        updateLocaleButtonsStatus = function($dom) {
            var $localeList;
            $localeList = $dom.find('.add-locale ul li:not(.hidden)');
            if ($localeList.length === 0) {
                return $dom.find('.add-locale').hide();
            } else {
                return $dom.find('.add-locale').show();
            }
        };
        toggleTab = function($tab, active) {
            var $addButton;
            $addButton = $tab.parents('ul').find('.add-locale li:has(a[href="' + $tab.attr('href') + '"])');
            if (active) {
                $tab.addClass('hidden').show().removeClass('hidden');
                return $addButton.hide().addClass('hidden');
            } else {
                $tab.addClass('hidden').hide().addClass('hidden');
                return $addButton.show().removeClass('hidden');
            }
        };
        return $(".activeadmin-translations > ul").each(function() {
            var $addLocaleButton, $contents, $dom, $form, $removeButton, $tabs, availableLocales, showAction;
            $dom = $(this);
            showAction = $dom.hasClass('locale-selector');
            if (!$dom.data("ready")) {
                $dom.data("ready", true);
                $tabs = $("li > a", this);
                $contents = showAction ? $(this).siblings("div.field-translation") : $(this).siblings("fieldset");
                $tabs.click(function(e) {
                    var $tab;
                    $tab = $(this);
                    $tabs.not($tab).removeClass("active");
                    $tab.addClass("active");
                    $contents.hide();
                    $contents.filter($tab.attr("href")).show();
                    return e.preventDefault();
                });
                $tabs.eq(0).click();
                if (showAction) {
                    return;
                }
                availableLocales = [];
                $tabs.not('.default').each(function() {
                    return availableLocales.push($('<li></li>').append($(this).clone().removeClass('active')));
                });
                $addLocaleButton = $('<li class="add-locale"><a href="#">+</a></li>');
                $addLocaleButton.append($('<ul></ul>').append(availableLocales));
                $addLocaleButton.find('ul a').click(function(e) {
                    var $tab, href;
                    href = $(this).attr('href');
                    $tab = $tabs.filter('[href="' + href + '"]');
                    toggleTab($tab, true);
                    $tab.click();
                    updateLocaleButtonsStatus($dom);
                    return e.preventDefault();
                });
                $removeButton = $('<span class="remove">x</span>').click(function(e) {
                    var $tab;
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    $tab = $(this).parent();
                    toggleTab($tab, false);
                    if ($tab.hasClass('active')) {
                        $tabs.not('.hidden').eq(0).click();
                    }
                    return updateLocaleButtonsStatus($dom);
                });
                $tabs.not('.default').append($removeButton);
                $dom.append($addLocaleButton);
                $tabs.each(function() {
                    var $content, $tab, containsErrors, hide;
                    $tab = $(this);
                    $content = $contents.filter($tab.attr("href"));
                    containsErrors = $content.find(".input.error").length > 0;
                    $tab.toggleClass("error", containsErrors);
                    hide = true;
                    if ($tab.hasClass('error') || $tab.hasClass('default')) {
                        hide = false;
                    } else {
                        $content.find('[name]').not('[type="hidden"]').each(function() {
                            if ($(this).val()) {
                                hide = false;
                                return false;
                            }
                        });
                    }
                    if (hide) {
                        return toggleTab($tab, false);
                    } else {
                        return toggleTab($tab, true);
                    }
                });
                $form = $dom.parents('form');
                if (!$form.data('ready')) {
                    $form.data('ready');
                    $form.submit(function() {
                        return $('.activeadmin-translations > ul').each(function() {
                            var $fieldsets;
                            $fieldsets = $(this).siblings('fieldset');
                            return $("li:not(.add-locale) > a", this).each(function() {
                                var $currentFieldset, $destroy, $translationId;
                                if ($(this).hasClass('hidden')) {
                                    $currentFieldset = $("fieldset" + ($(this).attr('href')));
                                    $translationId = $('input[id$=_id]', $currentFieldset);
                                    if ($translationId.val()) {
                                        $destroy = $('<input/>').attr({
                                            type: 'hidden',
                                            name: $translationId.attr('name').replace('[id]', '[_destroy]'),
                                            id: $translationId.attr('id').replace('_id', '_destroy'),
                                            value: '1'
                                        });
                                        return $destroy.appendTo($currentFieldset);
                                    } else {
                                        return $fieldsets.filter($(this).attr('href')).remove();
                                    }
                                }
                            });
                        });
                    });
                }
                updateLocaleButtonsStatus($dom);
                return $tabs.filter('.default').click();
            }
        });
    };
    $("a").bind("click", function() {
        return setTimeout(function() {
            return translations();
        }, 50);
    });
    $('a.ui-translation-trigger').click(function(e) {
        var $locale, $td;
        $locale = $(this).data('locale');
        $td = $(this).closest('td');
        $('.field-translation', $td).hide();
        $(".locale-" + $locale, $td).show();
        $(this).parent().children('a.ui-translation-trigger').removeClass('active');
        $(this).addClass('active');
        return e.preventDefault();
    });
    return translations();
});
