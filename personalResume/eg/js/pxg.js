/**
 * Created by Administrator on 2015/5/9.
 */

//id选择器
if(document.all && !document.getElementById) {
    document.getElementById = function(id) {
        return document.all[id];
    }
}

if (!String.repeat) {
    String.prototype.repeat = function(l){
        return new Array(l+1).join(this);   }
}
//添加去除空白字符的
if (!String.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g,'');
    }
}

(function(){
    //命名空间声明
    if(!window['pxg']) {
        window['pxg'] = {};
    }
    //能力检测
    function isCompatible(other) {
        // Use capability detection to check requirements
        if( other===false|| !Array.prototype.push || !Object.hasOwnProperty|| !document.createElement || !document.getElementsByTagName)
        {
            alert('TR- if you see this message isCompatible is failing incorrectly.');
            return false;
        }
        return true;
    }
    window['pxg']['isCompatible'] = isCompatible;
    //选择符
    function $() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            // If the argument is a string assume it's an id
            if (typeof element == 'string') {
                element = document.getElementById(element);
            }
            // If only one argument was supplied, return the element immediately
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        // Return the array of multiple requested elements
        return elements;
    };
    window['pxg']['$'] = $;
   //事件绑定
    function addEvent( node, type, listener ) {
        if(!isCompatible()) { return false }
        if(!(node = $(node))) return false;
        if (node.addEventListener) {
            node.addEventListener( type, listener, false );
            return true;
        } else if(node.attachEvent) {
            node['e'+type+listener] = listener;
            node[type+listener] = function(){node['e'+type+listener]( window.event );}
            node.attachEvent( 'on'+type, node[type+listener] );
            return true;
        }
        return false;
    };
    window['pxg']['addEvent'] = addEvent;
    //移除事件绑定
    function removeEvent(node, type, listener ) {
        if(!(node = $(node))) return false;
        if (node.removeEventListener) {
            node.removeEventListener( type, listener, false );
            return true;
        } else if (node.detachEvent) {
            node.detachEvent( 'on'+type, node[type+listener] );
            node[type+listener] = null;
            return true;
        }
        return false;
    };
    window['pxg']['removeEvent'] = removeEvent;
   //获取class
    function getElementsByClassName(className, tag, parent){
        parent = parent || document;
        if(!(parent = $(parent))) return false;
        var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchingElements = new Array();
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
        var element;
        for(var i=0; i<allTags.length; i++){
            element = allTags[i];
            if(regex.test(element.className)){
                matchingElements.push(element);
            }
        }
        return matchingElements;
    };
    window['pxg']['getElementsByClassName'] = getElementsByClassName;
    //切换显示状态
    function toggleDisplay(node, value) {
        if(!(node = $(node))) return false;
        if ( node.style.display != 'none' ) {
            node.style.display = 'none';
        } else {
            node.style.display = value || '';
        }
        return true;
    }
    window['pxg']['toggleDisplay'] = toggleDisplay;
    //改进加入后，，，原先是insertBefore
    function insertAfter(node, referenceNode) {
        if(!(node = $(node))) return false;
        if(!(referenceNode = $(referenceNode))) return false;

        return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
    };
    window['pxg']['insertAfter'] = insertAfter;
    //移除他的所有子节点
    function removeChildren(parent) {
        if(!(parent = $(parent))) return false;
        while (parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.firstChild);
        }
        return parent;
    };
    window['pxg']['removeChildren'] = removeChildren;
    /**
     * Insert a new node as the first child.
     */
    function prependChild(parent,newChild) {
        if(!(parent = $(parent))) return false;
        if(!(newChild = $(newChild))) return false;
        if(parent.firstChild) {
            // There is already a child so insert before the first one
            parent.insertBefore(newChild,parent.firstChild);
        } else {
            // No children so just append
            parent.appendChild(newChild);
        }
        // Return the parent again so you can stack the methods
        return parent;
    }
    window['pxg']['prependChild'] = prependChild;
    /********************************
     * Chapter 2
     *********************************/
    /*
     * Put the given object in teh context of the given method.
     */
    function bindFunction(obj, func) {
        return function() {
            func.apply(obj,arguments);
        };
    };
    window['pxg']['bindFunction'] = bindFunction;
    //获取窗口大小
    function getBrowserWindowSize() {
        var de = document.documentElement;
        return {
            'width':(
                window.innerWidth
                || (de && de.clientWidth )
                || document.body.clientWidth),
            'height':(
                window.innerHeight
                || (de && de.clientHeight )
                || document.body.clientHeight)
        }
    };
    window['pxg']['getBrowserWindowSize'] = getBrowserWindowSize;
   //node的节点值
    window['pxg']['node'] = {
        ELEMENT_NODE                : 1,
        ATTRIBUTE_NODE              : 2,
        TEXT_NODE                   : 3,
        CDATA_SECTION_NODE          : 4,
        ENTITY_REFERENCE_NODE       : 5,
        ENTITY_NODE                 : 6,
        PROCESSING_INSTRUCTION_NODE : 7,
        COMMENT_NODE                : 8,
        DOCUMENT_NODE               : 9,
        DOCUMENT_TYPE_NODE          : 10,
        DOCUMENT_FRAGMENT_NODE      : 11,
        NOTATION_NODE               : 12
    };
    /**
     * Walk the nodes in the DOM tree without maintaining parent/child relationships.
     */
    function walkElementsLinear(func,node) {
        var root = node || window.document;
        var nodes = root.getElementsByTagName("*");
        for(var i = 0 ; i < nodes.length ; i++) {
            func.call(nodes[i]);
        }
    };
    window['pxg']['walkElementsLinear'] = walkElementsLinear;
    /**
     * Walk the nodes in the DOM tree maintaining parent/child relationships.
     */
    function walkTheDOMRecursive(func,node,depth,returnedFromParent) {
        var root = node || window.document;
        returnedFromParent = func.call(root,depth++,returnedFromParent);
        node = root.firstChild;
        while(node) {
            walkTheDOMRecursive(func,node,depth,returnedFromParent);
            node = node.nextSibling;
        }
    };
    window['pxg']['walkTheDOMRecursive'] = walkTheDOMRecursive;
    /**
     * Walk the nodes in the DOM tree maintaining parent/child relationships and include the node attributes as well.
     */
    function walkTheDOMWithAttributes(node,func,depth,returnedFromParent) {
        var root = node || window.document;
        returnedFromParent = func(root,depth++,returnedFromParent);
        if (root.attributes) {
            for(var i=0; i < root.attributes.length; i++) {
                walkTheDOMWithAttributes(root.attributes[i],func,depth-1,returnedFromParent);
            }
        }
        if(root.nodeType != ADS.node.ATTRIBUTE_NODE) {
            node = root.firstChild;
            while(node) {
                walkTheDOMWithAttributes(node,func,depth,returnedFromParent);
                node = node.nextSibling;
            }
        }
    };
    window['pxg']['walkTheDOMWithAttributes'] = walkTheDOMWithAttributes;

    /**
     * Walk the DOM recursively using a callback function
     */
    function walkTheDOM(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkTheDOM(node, func);
            node = node.nextSibling;
        }
    }
    window['pxg']['walkTheDOM'] = walkTheDOM;
   //使用驼峰法
    function camelize(s) {
        return s.replace(/-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
    }
    window['pxg']['camelize'] = camelize;

    //命名不用驼峰法
    function uncamelize(s, sep) {
        sep = sep || '-';
        return s.replace(/([a-z])([A-Z])/g, function (strMatch, p1, p2){
            return p1 + sep + p2.toLowerCase();
        });
    }
    window['pxg']['camelize'] = camelize;
    /**
     * Add a load event that will run when the document finishes loading - excluding images.
     */
    function addLoadEvent(loadEvent,waitForImages) {
        if(!isCompatible()) return false;
        if(waitForImages) {
            return addEvent(window, 'load', loadEvent);
        }
        // Otherwise use a number of different methods

        // Wrap the loadEvent method to assign the correct content for the
        // this keyword and ensure that the event doesn't execute twice
        var init = function() {
            if (arguments.callee.done) return;
            // Return if this function has already been called
            // Mark this function so you can verify if it was already run
            arguments.callee.done = true;
            // Run the load event in the context of the document
            loadEvent.apply(document,arguments);
        };
        // Register the event using the DOMContentLoaded event
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", init, false);
        }
        // For Safari, use a setInterval() to see if the document has loaded
        if (/WebKit/i.test(navigator.userAgent)) {
            var _timer = setInterval(function() {
                if (/loaded|complete/.test(document.readyState)) {
                    clearInterval(_timer);
                    init();
                }
            },10);
        }
        return true;
    }
    window['pxg']['addLoadEvent'] = addLoadEvent;
    //阻止冒泡
    function stopPropagation(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        if(eventObject.stopPropagation) {
            eventObject.stopPropagation();
        } else {
            eventObject.cancelBubble = true;
        }
    }
    window['pxg']['stopPropagation'] = stopPropagation;
   //阻止默认事件
    function preventDefault(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        if(eventObject.preventDefault) {
            eventObject.preventDefault();
        } else {
            eventObject.returnValue = false;
        }
    }
    window['pxg']['preventDefault'] = preventDefault;
    //得到对象
    function getEventObject(W3CEvent) {
        return W3CEvent || window.event;
    }
    window['pxg']['getEventObject'] = getEventObject;
    /**
     * Retrieves the element targeted by the event.
     */
    function getTarget(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        // Check if the target is W3C or MSIE
        var target = eventObject.target || eventObject.scrElement;
        // Reassign the target to the parent
        // if it is a text node like in Safari
        if(target.nodeType == pxg.node.TEXT_NODE) {
            target = node.parentNode;
        }
        return target;
    }
    window['pxg']['getTarget'] = getTarget;
    /**
     * Determine which mouse button was pressed
     */
    function getMouseButton(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        // Initialize an object wit the appropriate properties
        var buttons = {
            'left':false,
            'middle':false,
            'right':false
        };
        // Check the toString value of the eventObject
        // W3C Dom object have a toString method and in this case it
        // should be MouseEvent
        if(eventObject.toString && eventObject.toString().indexOf('MouseEvent') != -1) {
            // W3C Method
            switch(eventObject.button) {
                case 0: buttons.left = true; break;
                case 1: buttons.middle = true; break;
                case 2: buttons.right = true; break;
                default: break;
            }
        } else if(eventObject.button) {
            // MSIE method
            switch(eventObject.button) {
                case 1: buttons.left = true; break;
                case 2: buttons.right = true; break;
                case 3:
                    buttons.left = true;
                    buttons.right = true;
                    break;
                case 4: buttons.middle = true; break;
                case 5:
                    buttons.left = true;
                    buttons.middle = true;
                    break;
                case 6:
                    buttons.middle = true;
                    buttons.right = true;
                    break;
                case 7:
                    buttons.left = true;
                    buttons.middle = true;
                    buttons.right = true;
                    break;
                default: break;
            }
        } else {
            return false;
        }
        return buttons;
    }
    window['pxg']['getMouseButton'] = getMouseButton;
    //得到鼠标点击时的坐标值
    function getPointerPositionInDocument(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var x = eventObject.pageX || (eventObject.clientX +(document.documentElement.scrollLeft || document.body.scrollLeft));
        var y= eventObject.pageY || (eventObject.clientY +(document.documentElement.scrollTop || document.body.scrollTop));
        //x and y now contain the coordinates of the mouse relative to the document origin
        return {'x':x,'y':y};
    }
    window['pxg']['getPointerPositionInDocument'] = getPointerPositionInDocument;
    //得到点击键得到的值
    function getKeyPressed(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var code = eventObject.keyCode;
        var value = String.fromCharCode(code);
        return {'code':code,'value':value};
    }
    window['pxg']['getKeyPressed'] = getKeyPressed;
    /********************************
     * Chapter 5
     *********************************/
    /**
     * Changes the style of a single element by id
     */
    function setStyleById(element, styles) {
        // Retrieve an object reference
        if(!(element = $(element))) return false;
        // Loop through  the styles object an apply each property
        for (property in styles) {
            if(!styles.hasOwnProperty(property)) continue;
            if(element.style.setProperty) {
                //DOM2 Style method
                element.style.setProperty(
                    uncamelize(property,'-'),styles[property],null);
            } else {
                //Alternative method
                element.style[camelize(property)] = styles[property];
            }
        }
        return true;
    }
    window['pxg']['setStyle'] = setStyleById;
    window['pxg']['setStyleById'] = setStyleById;

    /**
     * Changes the style of multiple elements by class name
     */
    function setStylesByClassName(parent, tag, className, styles) {
        if(!(parent = $(parent))) return false;
        var elements = getElementsByClassName(className, tag, parent);
        for (var e = 0 ; e < elements.length ; e++) {
            setStyleById(elements[e], styles);
        }
        return true;
    }
    window['pxg']['setStylesByClassName'] = setStylesByClassName;
    /**
     * Changes the style of multiple elements by tag name
     */
    function setStylesByTagName(tagname, styles, parent) {
        parent = $(parent) || document;
        var elements = parent.getElementsByTagName(tagname);
        for (var e = 0 ; e < elements.length ; e++) {
            setStyleById(elements[e], styles);
        }
    }
    window['pxg']['setStylesByTagName'] = setStylesByTagName;
    //将改节点的类名用空格划分为数组
    function getClassNames(element) {
        if(!(element = $(element))) return false;
        return element.className.replace(/\s+/,' ').split(' ');
    };
    window['pxg']['getClassNames'] = getClassNames;
   //核对该标签是否含有此class类名
    function hasClassName(element, className) {
        if(!(element = $(element))) return false;
        var classes = getClassNames(element);
        for (var i = 0; i < classes.length; i++) {
            // Check if the className matches and return true if it does
            if (classes[i] === className) { return true; }
        }
        return false;
    };
    window['pxg']['hasClassName'] = hasClassName;
    //增加class名
    function addClassName(element, className) {
        if(!(element = $(element))) return false;
        // Append the classname to the end of the current className
        // If there is no className, don't include the space
        element.className += (element.className ? ' ' : '') + className;
        return true;
    };
    window['pxg']['addClassName'] = addClassName;
    //移除一个class名
    function removeClassName(element, className) {
        if(!(element = $(element))) return false;
        var classes = getClassNames(element);
        var length = classes.length
        //loop through the array in reverse, deleting matching items
        // You loop in reverse as you're deleting items from
        // the array which will shorten it.
        for (var i = length-1; i >= 0; i--) {
            if (classes[i] === className) { delete(classes[i]); }
        }
        element.className = classes.join(' ');
        return (length == classes.length ? false : true);
    };
    window['pxg']['removeClassName'] = removeClassName;
   //增加样式表
    function addStyleSheet(url,media) {
        media = media || 'screen';
        var link = document.createElement('LINK');
        link.setAttribute('rel','stylesheet');
        link.setAttribute('type','text/css');
        link.setAttribute('href',url);
        link.setAttribute('media',media);
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    window['pxg']['addStyleSheet'] = addStyleSheet;
    /**
     * Remove a stylesheet
     */
    function removeStyleSheet(url,media) {
        var styles = getStyleSheets(url,media);
        for(var i = 0 ; i < styles.length ; i++) {
            var node = styles[i].ownerNode || styles[i].owningElement;
            // Disable the stylesheet
            styles[i].disabled = true;
            // Remove the node
            node.parentNode.removeChild(node);
        }
    }
    window['pxg']['removeStyleSheet'] = removeStyleSheet;

    /**
     * Retrieve an array of all the stylesheets by URL
     */
    function getStyleSheets(url,media) {
        var sheets = [];
        for(var i = 0 ; i < document.styleSheets.length ; i++) {
            if (url &&  document.styleSheets[i].href.indexOf(url) == -1) { continue; }
            if(media) {
                // Normaizle the media strings
                media = media.replace(/,\s*/,',');
                var sheetMedia;
                if(document.styleSheets[i].media.mediaText) {
                    // DOM mehtod
                    sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
                    // Safari adds an extra comma and space
                    sheetMedia = sheetMedia.replace(/,\s*$/,'');
                } else {
                    // MSIE
                    sheetMedia = document.styleSheets[i].media.replace(/,\s*/,',');
                }
                // Skip it if the media don't match
                if (media != sheetMedia) { continue; }
            }
            sheets.push(document.styleSheets[i]);
        }
        return sheets;
    }
    window['pxg']['getStyleSheets'] = getStyleSheets;

    function editCSSRule(selector,styles,url,media) {
        var styleSheets = (typeof url == 'array' ? url : getStyleSheets(url,media));
        for ( i = 0; i < styleSheets.length; i++ ) {
            // 通常支持 styleSheets[i].cssRules但是Ie使用styleSheets[i].rules
            var rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (!rules) { continue; }

            // Convert to uppercase as MSIIE defaults to UPPERCASE tags.
            // this could cause conflicts if you're using case sensetive ids
            selector = selector.toUpperCase();

            for(var j = 0; j < rules.length; j++) {
                if(rules[j].selectorText.toUpperCase() == selector) {
                    for (property in styles) {
                        if(!styles.hasOwnProperty(property)) { continue; }
                        // Set the new style property
                        rules[j].style[camelize(property)] = styles[property];
                    }
                }
            }
        }
    }
    window['pxg']['editCSSRule'] = editCSSRule;

    function addCSSRule(selector, styles, index, url, media) {
        var declaration = '';
        for (property in styles) {
            if(!styles.hasOwnProperty(property)) { continue; }
            declaration += property + ':' + styles[property] + '; ';
        }
        var styleSheets = (typeof url == 'array' ? url : getStyleSheets(url,media));
        var newIndex;
        for(var i = 0 ; i < styleSheets.length ; i++) {
            // Add the rule
            if(styleSheets[i].insertRule) {
                // The DOM2 Style method
                // index = length is the end of the list
                newIndex = (index >= 0 ? index : styleSheets[i].cssRules.length);
                styleSheets[i].insertRule(selector + ' { ' + declaration + ' } ',
                    newIndex);
            } else if(styleSheets[i].addRule) {
                // The Microsoft method
                // index = -1 is the end of the list
                newIndex = (index >= 0 ? index : -1);
                styleSheets[i].addRule(selector, declaration, newIndex);
            }
        }
    }
    window['pxg']['addCSSRule'] = addCSSRule;
    //计算的样式，不能通过style直接点号获取的值
    function getStyle(element,property) {
        if(!(element = $(element)) || !property) return false;
        var value = element.style[camelize(property)];
        if (!value) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var css = document.defaultView.getComputedStyle(element, null);
                value = css ? css.getPropertyValue(property) : null;
            } else if (element.currentStyle) {             //ie浏览器
                value = element.currentStyle[camelize(property)];
            }
        }
        return value == 'auto' ? '' : value;
    }
    window['pxg']['getStyle'] = getStyle;
    window['pxg']['getStyleById'] = getStyle;
})();