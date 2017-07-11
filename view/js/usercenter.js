ROOT = "http://115.159.188.200:8000/"
IMGROOT = "http://115.159.188.200:8000"

//个人中心修改

//构建用于ajax交互的表单
function buildForm() {
    var $inputEle = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

    var $form = $("<form id='ajaxForm' method='post'></form>"),
        csrfToken = $('meta[name=csrf-token]').attr('content'),
        csrfParam = $('meta[name=csrf-param]').attr('content');

    if (csrfParam !== undefined && csrfToken !== undefined) {
        $form.append($('<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />'));
    }

    $form.append($inputEle);
    return $form;
}

function confirm(title, text, callback) {
    if ($("#btn-confirm-modal").length > 0) {
        $("#btn-confirm-modal").remove();
    }
    var html = $("<div class='modal fade' id='btn-confirm-modal' >\n          <div class='modal-dialog' style='z-index:1124; width:400px; margin-top:200px;'>\n            <div class='modal-content' style=' width: 100%;'>\n              <div class='modal-body text-center' id='myConfirmContent'>\n                <button type='button' class='close' data-dismiss='modal' style='margin: -10px -10px 0 0;'>\n                  <span style='font-size:15px; color: red; top: 0px;' class='glyphicon glyphicon-remove'></span>\n                </button>\n                <div id='info-text' style=\"color: black;\">\n                " + text + "\n                </div>\n              </div>\n              <div class='modal-footer ' style='padding: 8px; text-align: center;'>\n                <button class='btn-sm btn-danger' data-dismiss='modal' style='margin-right: 5px; border: none;'>取消</button>\n                <button class='btn-sm btn-primary' id='confirmOk' style='margin-left: 5px; border: none;'>确定</button>\n              </div>\n            </div>\n          </div>\n        </div>");

    $("body").append(html);

    $("#btn-confirm-modal").modal("show");
    $("#confirmOk").focus();

    $("#confirmOk").on("click", function () {
        $("#btn-confirm-modal").modal("hide").bind("hidden.bs.modal", function () {
            $("#btn-confirm-modal").remove();
        });
        callback(); // 执行函数
    });
    return false;
};


$(document).ready(function () {

    //样式改变
    $('*[role=revise]').on("click", showRevise);
    $("*[role='cancel'], *[role='conform']").on("click", dismissRevise);
    //确认修改
    $("*[role='conform']").on("click", doRevise);
    $("*[role='edit']").on("dismiss", dismissRevise).on("keyup", function (e) {
        if (e.which === 13) {
            doRevise.call(this);
            dismissRevise.call(this);
        }
    });
});

// 显示取消和确认修改的按钮
function showRevise() {
    var $item = $(this).parents(".info-item");

    // 隐藏其他修改框
    $("*[role='edit']").not($(this)).trigger("dismiss");

    //更改内容
    var currentInfo = $item.find("*[role='info']").text().trim();

    //显示和隐藏
    $item.find("*[role='info']").hide().siblings().show();
    $item.find(".revise").hide().siblings().show();
    // 更改内容并获取焦点
    $item.find("*[role='edit']").val(currentInfo).focus();
}

// 隐藏
function dismissRevise() {
    var $item = $(this).parents(".info-item");
    $item.find(".control-group").hide().siblings().show();
    $item.find("*[role='info']").show().siblings().hide();
}
// 修改
function doRevise() {
    var $item = $(this).parents(".info-item");
    var $target = $item.find("*[role='edit']");
    var $input = $("<input name=\"" + $target.attr("name") + "\" value=\"" + $target.val() + "\" type=\"hidden\" />");
    var url = ROOT + "do_modify_user_profile/";
    var $reviseEle = $item.find("*[role='info']");
    var attr = $reviseEle.data('attr');
    $reviseEle.text($target.val());

    var $ajaxForm = buildForm($input);
    reviseInfo($ajaxForm, url, $item);
}

//个人中心修改ajax后台交互
function reviseInfo($ajaxForm, url, $item) {
    $.ajax({
        data: $ajaxForm.serialize(),
        dataType: "json",
        url: url,
        type: "POST",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(function (res) {
        // var $reviseEle = $item.find("*[role='info']");
        // var attr = $reviseEle.data('attr');
        // $reviseEle.text(res[attr]);
    }).fail(function (res) {});
    $ajaxForm.remove();
};
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */



+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
//禁用Enter键表单自动提交
"use strict";

document.onkeydown = function (event) {
    var target, code, tag;
    if (!event) {
        event = window.event; //针对ie浏览器
        target = event.srcElement;
        code = event.keyCode;
        if (code == 13) {
            tag = target.tagName;
            if (tag == "TEXTAREA") {
                return true;
            } else {
                return false;
            }
        }
    } else {
        target = event.target; //针对遵循w3c标准的浏览器，如Firefox
        code = event.keyCode;
        if (code == 13) {
            tag = target.tagName;
            if (tag == "INPUT") {
                return false;
            } else {
                return true;
            }
        }
    }
};
// $(function() {
//     var UnloadConfirm = {};
//     UnloadConfirm.MSG_UNLOAD = "数据尚未保存，离开后可能会导致数据丢失\n\n您确定要离开吗？";
//     UnloadConfirm.set = function(a) {
//         window.onbeforeunload = function(b) {
//             b = b || window.event;
//             b.returnValue = a;
//             return a
//         }
//     };
//     UnloadConfirm.clear = function() {
//         fckDraft.delDraftById();
//         window.onbeforeunload = function() {}
//     };
//     UnloadConfirm.set(UnloadConfirm.MSG_UNLOAD);
// })

/**
 * 当离开页面时，内容有修改且未提交，弹出确认框警告
 * 暂时仅适用于form标签
 * 使用方法：在form标签中添加属性leavingTip=true即可
 */

'use strict';

$(function () {
    // 定义符合要求的表单元素
    var formSelected = "form[leaving-tip=true]";
    // 判断页面上是否有需要提示的表单
    if ($(formSelected).is('form')) {
        leaveWarning(formSelected);
    }

    function leaveWarning(formSelected) {
        var isModified = false;
        var notSubmit = true;

        $(formSelected).find('input,select,textarea').change(function () {
            // 可考虑扩展，利用this变量来高亮这个有内容修改的输入框来提示用户
            isModified = true;
        });
        window.onbeforeunload = function () {
            // 当表单内容有修改且并未提交时，离开页面弹出提示
            if (isModified && notSubmit) {
                return true;
            };
        };

        $(formSelected).on('submit', function () {
            notSubmit = false;
        });
    }
});
/**
 * 自定义数据验证插件
 * 依赖jQuery插件
 * 使用方式：
 * $(selector).validate({
 *   rules: {
 *     'inputA': "required",
 *     'inputB': "number",
 *     'inputC': /^[a-z]+$/,
 *     'inputD': {
 *        "required": true,
 *        "regex": /pattern/,
 *        "maxLength": 3
 *      }
 *   },
 *   messages: {
 *     'inputA': "A不能为空",
 *     'inputB': "B只能为数字",
 *     'inputC': "C只能为小写字母"
 *     'inputD': {
 *        "required": "D不能为空",
 *        "regex": "D要符合xx格式",
 *        "maxLength": "D长度最大值为3"
 *      }
 *   },
 *   errorClass: "error-class-name"
 * });
 *
 * 注意事项：
 * 1. selector必须为表单元素
 * 2. inputA,B,C,D必须是该表单的子元素（不需要为直接子元素）
 * 3. 示例中的inputA,B,C,D分别是相应表单元素的name属性值
 *
 * Created by JasonSi
 */

"use strict";

(function ($) {
    // 定义一些正则表达式用于判断
    var REGEX = {
        required: {
            reg: /\S+/,
            message: "不能为空"
        },

        number: {
            reg: /^$|^[+-]?\d+(\.\d+)?$/,
            message: "只能为数值或不填"
        },
        integer: {
            reg: /^$|^[+-]?\d+$/,
            message: "只能为整数或不填"
        },
        positiveInteger: {
            reg: /^$|^\+?[1-9]\d*$/,
            message: "只能为正整数或不填"
        },
        digits: {
            reg: /^$|^\d*$/,
            message: "只能含有数字或不填"
        },
        email: {
            reg: /^$|^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            message: "请输入正确的邮箱"
        },
        account: {
            reg: /^$|^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
            //  ^[\u4e00-\u9fa5A-Za-z0-9-_]*$  只能中英文，数字，下划线，减号
            message: "汉字、数字、字母、下划线"
        },
        password: {
            // reg: /^\w{6,20}$/,

            reg: /^$|[a-zA-Z0-9_.,~!@#$%^&*()_+-=<>:;|?/\\`'"\[\]]+$/,
            message: "数字、字母或特殊符号，4-20位"
        },
        url: {
            reg: /^$|^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
            message: "只能为URL格式或不填"
        },
        cellphone: {
            reg: /^$|^1(3[0-9]|5[012356789]|7[678]|8[0-9]|4[57])[0-9]{8}$/,
            message: "请输入正确的手机号"
        },
        date: {
            reg: /^$|^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
            message: "请输入正确的日期格式（xxxx-xx-xx）"
        },
        time: {
            reg: /^$|^((0\d|1\d)|(2[0123]))(:[0-5]\d){1,2}$/,
            message: "只能为时间格式（xx:xx:xx或xx:xx）或不填"
        },
        ID: {
            reg: /^$|(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
            message: "请输入有效身份证"
        },
        sex: {
            reg: /^$|^(\u7537|\u5973)$/,
            message: "请输入男或女"
        }
    };

    var defaults = {

        // 定义默认错误类名，用以添加样式
        errorClass: "error",
        addErrorMsg: true,

        // 定义默认的错误提示信息
        errorMessage: function errorMessage(regulation) {
            var defaultMessage = "格式不正确";

            if (RegExp.prototype.isPrototypeOf(regulation)) {
                return defaultMessage;
            } else if (typeof regulation == "string") {
                if (REGEX.hasOwnProperty(regulation)) {
                    return REGEX[regulation].message;
                } else {
                    return defaultMessage;
                }
            } else if (typeof regulation == "object") {
                var rName = regulation.regulationName;
                var rDetail = regulation.regulationDetail;
                switch (rName) {
                    case "equalTo":
                        return "两次输入内容不一致";
                    case "maxLength":
                        return "不能超过" + parseInt(rDetail) + "个字符";
                    case "minLength":
                        return "不能少于" + parseInt(rDetail) + "个字符";
                    case "max":
                        return "数值不能大于" + parseInt(rDetail);
                    case "min":
                        return "数值不能小于" + parseInt(rDetail);
                    default:
                        return rDetail && REGEX[rName] ? REGEX[rName].message : defaultMessage;
                }
            } else {
                return defaultMessage;
            }
        }
    };

    var methods = {
        simpleJudge: function simpleJudge(regulation, value) {
            // TODO: 支持更多的验证格式
            if (RegExp.prototype.isPrototypeOf(regulation)) {
                return regulation.test(value);
            } else if (REGEX.hasOwnProperty(regulation)) {
                return REGEX[regulation].reg.test(value);
            } else {
                console.error("不支持\"" + regulation + "\"类型数据验证，默认通过验证");
                return true;
            }
        },
        furtherJudge: function furtherJudge(regulationName, regulationDetail, value) {
            if (typeof regulationName != 'string') return true;

            if (REGEX.hasOwnProperty(regulationName)) {
                return !regulationDetail || REGEX[regulationName].reg.test(value);
            } else {
                switch (regulationName) {
                    case 'equalTo':
                        return $(this).find("[name=\"" + regulationDetail + "\"]").val() == value;
                    case 'regex':
                        return RegExp(regulationDetail).test(value);
                    case 'maxLength':
                        return value.length <= parseInt(regulationDetail);
                    case 'minLength':
                        return value.length >= parseInt(regulationDetail);
                    case 'max':
                        return !value || parseFloat(value) <= parseFloat(regulationDetail);
                    case 'min':
                        return !value || parseFloat(value) >= parseFloat(regulationDetail);
                    default:
                        console.error("不支持\"" + regulationName + "\"类型数据验证，默认通过验证");
                        return true;
                }
            }
        },

        addError: function addError(element, message, errorClass) {
            // TODO: 当有多个错误时，寻找一个更友好的显示方式
            var existLabel = element.next("label." + errorClass);
            if (existLabel.length) {
                existLabel[0].innerHTML += " " + message;
            } else {
                var label = "<label class=\"" + errorClass + "\" for=\"" + element.attr("name") + "\">" + message + "</label>";
                element.after(label);
            }
        },
        errorMessage: function errorMessage(regulation, customMessage) {
            var result;
            if (typeof customMessage == 'object') {

                // 如果是对象，则取对应regulation的message
                customMessage = customMessage || {};

                if (typeof regulation == "object") {
                    result = customMessage[regulation.regulationName];
                } else {
                    result = customMessage[regulation];
                }
            } else {
                result = customMessage;
            }
            // 如果result是0，“”，undefined，null等值，则返回默认值
            return result || defaults.errorMessage(regulation) || "格式不正确";
        },
        checkError: function checkError(regulation, inputName, errorClass, callback) {
            // 根据name属性值寻找需要数据验证的元素
            var $input = $(this).find("[name=\"" + inputName + "\"]");
            if (!$input.length) return true;

            // 清除之前检验产生的错误提示标签
            $input.next("label." + errorClass).remove();

            if (typeof regulation == "object" && !RegExp.prototype.isPrototypeOf(regulation)) {

                // Sample: rules:{"inputFoo": {"required": true, "maxLength": 16}}
                regulation = regulation || {};
                var inputVali = true;

                for (var r in regulation) {

                    if (!methods.furtherJudge.call(this, r, regulation[r], $input.val())) {

                        if (inputVali) {
                            $input.removeClass("legel").addClass("illegel");
                            inputVali = false;
                        }

                        callback($input, {
                            regulationName: r,
                            regulationDetail: regulation[r]
                        });
                    } else {
                        if (inputVali) {
                            $input.removeClass("illegel").addClass("legel");
                        }
                    }
                }
            } else {

                // Sample: rules:{"inputFoo": "required"}
                if (!methods.simpleJudge.call(this, regulation, $input.val())) {
                    $input.removeClass("legel").addClass("illegel");

                    callback($input, regulation);
                } else {
                    $input.removeClass("illegel").addClass("legel");
                }
            }
        },

        checkOnBlur: function checkOnBlur(regulation, inputName) {}

    };

    var addValidator = function addValidator(arg) {
        var rules = arg.rules || {};
        var messages = arg.messages || {};
        var errorClass = arg.errorClass;
        var addErrorMsg = arg.addErrorMsg || defaults.addErrorMsg;
        // 如果传入对象或者null,undefined,''等空值，使用默认值
        if (typeof errorClass == "object" || !errorClass) {
            errorClass = defaults.errorClass;
        }

        this.submit(function () {
            var isValid = true;
            for (var inputName in rules) {
                methods.checkError.call(this, rules[inputName], inputName, errorClass, function (element, regulation) {
                    if (addErrorMsg) {
                        var message = methods.errorMessage(regulation, messages[inputName]);
                        methods.addError(element, message, errorClass);
                    }

                    // 一旦有一个数据验证结果错误， 就会执行该回调， 将标志位置为false
                    isValid = false;
                });
            }
            return isValid;
        });

        var inputValid = true;
        for (var inputName in rules) {
            var $this = $(this),
                $input = $this.find("[name=\"" + inputName + "\"]");
            if (!$input.length) return true;

            (function ($input, inputName) {
                $input.bind("blur", function () {
                    callback();
                });
                $input.bind("input propertychange", function () {
                    if ($input.hasClass("illegel")) {
                        callback();
                    }
                });

                function callback() {
                    methods.checkError.call($this, rules[inputName], inputName, errorClass, function (element, regulation) {
                        if (addErrorMsg) {
                            var message = methods.errorMessage(regulation, messages[inputName]);
                            methods.addError(element, message, errorClass);
                        }
                    });
                }
            })($input, inputName);
        }
    };

    $.fn.validate = function () {
        var arg = arguments[0];
        if (!this.length) {
            return this;
        } else {
            return addValidator.call(this, arg);
        }
    };
})(jQuery);
"use strict";

$(document).ready(function () {

    $("body").on("click", "#vali-btn", function () {
        var _this = $(this);
        _this.attr("disabled", "true");
        if (_this.attr("time")) return false;
        _this.attr("time", "on");
        setTime(_this, 60);

        function setTime(ele, time) {
            if (time === 0) {
                ele.removeAttr("disabled time").text("重新获取验证码");
            } else {
                ele.text(time + "s秒后重新发送");
                setTimeout(function () {
                    setTime(ele, time - 1);
                }, 1000);
            }
        }

        var url = _this.data("url") || '/telcode';
        $.post({
            url: url + '?_rucaptcha=' + $("[name='_rucaptcha']").val() + "&phone=" + $("[role='phone']").val(),
            data: buildForm().serialize()
        });
    });

    // 验证码刷新
    $("body").on("click", "#vali-img", function () {
        $(this).attr("src", '/rucaptcha/');
        if ($("[name='_rucaptcha']").val().length > 0) {
            $("[name='_rucaptcha']").trigger("change");
        }
    });

    $("body").on("input propertychange", "#phone-code", function () {
        var _this = $(this);
        if (_this.val().length < 4) {
            $("#commit").attr("disabled", true);
            return false;
        }
        var telcode = _this.val();
        var fd = buildForm().serialize();

        $.post({
            url: '/check/telcode' + '?telcode=' + telcode,
            data: fd,
            dataType: "json",
            success: function success(data, status) {
                if (data.pass) {
                    $("#phone-code").addClass("legel").removeClass("illegel");
                    $("#commit").removeAttr("disabled");
                } else {
                    $("#phone-code").addClass("illegel").removeClass("legel");
                    $("#commit").attr("disabled", true);
                }
            },
            error: function error() {
                $("#commit").attr("disabled", true);
            }
        });
    });
});

$(document).ready(function () {
    // $('#comment').modal('hide');
    // $("span[role='mark']").on("click", function () {
    //     var index = $(this).index() + 1;
    //     console.log(index);
    //     $(this).nextAll().removeClass('glyphicon-star').addClass('glyphicon-star-empty').end().siblings().andSelf().slice(0, index).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
    //     $(this).parent().siblings('input').val(index);
    // });

    // 生成删除预约的表单
    $("#delete-order").on("click", function () {
        var id = $(this).data('id');
        confirm('确认删除', '删除该预约？', function () {
            var $input = $('<input type="hidden" name="_method" value="delete" />');

            buildForm($input).attr("action", '/orders/' + id).submit();
        });
    });
    // 生成删除消息的表单
    $("#delete-msg").on("click", function () {
        var id = $(this).data('id');
        confirm('', '删除该消息？', function () {

            var $input = $('<input type="hidden" name="_method" value="delete" />');

            buildForm($input).attr("action", '/usercenter/messages/' + id).submit();
        });
    });

    // 生成修改手机号的表单
    $("#edit-phone").on("click", function () {
        confirm('', setPhoneForm(), function () {
            var $input = $('<input type="hidden" name="_method" value="PATCH" />\n                            <input type="hidden" name="phone_code" value="' + $("#phone-code").val() + '">\n                            <input type="hidden" name="new_phone" value="' + $("#new-phone").val() + '">\n                        ');
            buildForm($input).attr("action", '/account/phone/update').submit();
        });
    });

    // 生成修改邮箱的表单
    $("#edit-email, #valid-email").on("click", function () {

        confirm('', setEmailForm(), function () {

            var $input = $('<input type="hidden" name="_method" value="post" />\n                            <input type="hidden" name="email" value="' + $("#email-input").val() + '">\n                         ');

            buildForm($input).attr("action", '/account/email/validate').submit();
        });
    });

    function setPhoneForm() {
        var oldPhone = $("#phone-info").text();
        return '\n        <form action="javascript: void(0)">\n          <div class="field">\n            <span style="text-align:left; float: left;">原手机号： ' + oldPhone + '</span>\n            <input type=\'hidden\' value=\'' + oldPhone + '\' role=\'phone\'>\n          </div>\n          <div class="field">\n            <div class=\'code-box\' style="width: 100%;">\n              <label for=\'vali-code\'>验证码</label>\n              <div class=\'code-box\' style="width: 100%;">\n              <input id=\'phone-code\' class=\'input form-control\' placeholder=\'请输入验证码\' name=\'new_phone\' />\n              <button id="vali-btn" class="btn btn-primary" style="width: 40%; float: left;" data-url=\'/_telcode\'>获取验证码</button>\n              </div>\n            </div>\n            <div class="field">\n              <label for=\'new-phone\'>请输入新手机号</label>\n              <input type="text" id="new-phone" class="input form-control">\n            </div>\n          </div>\n        </form>\n        ';
    }

    function setEmailForm() {
        var oldEmail = $("#edit-email").length > 0 ? "" : $("#email-info").text();
        var formTip = $("#edit-email").length > 0 ? "修改邮箱" : "验证邮箱";
        return '\n        <form action="javascript: void(0)">\n          <div class="field">\n              <label for=\'valid-email-input\'>' + formTip + '</label>\n              <input type="text" id="email-input" class="input form-control" value="' + oldEmail + '" placeholder="请输入邮箱">\n          </div>\n          <p style="text-align: left;">系统将发送验证信息到该邮箱，请注意查收验证</p>\n        </form>\n        ';
    }
});


// 获取用户课程
// 首页课程第一部分
$(function() {
	getCourses(ROOT + "get_courses/", courseBK);
})

// 动态添加课程
function getCourses(url, callBK) {
	$.ajax({
		url: url,
		type: "POST",
		dataType: "json",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success: function(res) {
			if (res.code == 1000) {
				console.log(res.courses);
				callBK(res);
			} else {
				console.log(res.msg);
			}
		},
		error: function(err) {
			console.log(err);
		}
	})
}

// 回调函数
function courseBK(res) {
	var $box = $("#user-course");
	var courses = res.courses
	var size = courses.length
	for(var i in courses) {
		$box.append(createCourse(courses[i]));
	}
    $box.on("click", "a", function() {
        window.location = $(this).data("href");
    })
}

// 生成课程节点
function createCourse(course) {
	var liStr = "\
        <div class='col-md-3 gallery-grid'>\
            <a data-href='/view/lesson.html?chapter_index=1&lesson_index=1&course_id=" + course.id + "' class='example-image-link' data-lightbox='example-set' target='_blank' >\
            <img class='example-image' src='" + IMGROOT + course.cover + "'/></a>\
        </div>\
	"
	return $(liStr);
}
