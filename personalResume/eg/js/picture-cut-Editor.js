/**
 * Created by Administrator on 2015/5/24.
 */
(function(){
    function getWindowSize(){     //得到宽，高
        if (self.innerHeight)      {
            return { 'width':self.innerWidth,'height':self.innerHeight };
        } else if (document.documentElement&& document.documentElement.clientHeight) {
            return {
                'width':document.documentElement.clientWidth,
                'height':document.documentElement.clientHeight
            };
        } else if (document.body) {
            return {
                'width':document.body.clientWidth,
                'height':document.body.clientHeight
            };
        }
    };
                  //元素的宽高边距等
    function getDimensions(e) {
        return {
            top:e.offsetTop,
            left:e.offsetLeft,
            width: e.offsetWidth,
            height: e.offsetHeight
        };
    };
                     // 设置所提供元素的上下左右边距，宽，高
    function setNumericStyle(e,dim,updateMessage) {
                      // 检查标记，看是否更新
        updateMessage = updateMessage || false;
                     //分配一个对象，原对象保持不变
        var style = {};
        for(var i in dim) {
            if(!dim.hasOwnProperty(i)) continue;
            style[i] = (dim[i]||'0') + 'px';
        }
        pxg.setStyle(e,style);
                    // 如果存在信息则需要更新
        if(updateMessage) {
            imageEditor.elements.cropSizeDisplay.firstChild.nodeValue = dim.width+ 'x' + dim.height;
        }
    };
                   // 声明图片编辑器的构造器了
    function imageEditor() { };
                    //编辑图像时保存的信息
    imageEditor.info = {
        resizeCropArea:false,
        pointerStart:null,
        resizeeStart:null,
        cropAreaStart:null,
        imgSrc:null
    };
                 // 保存编辑器中DOM对象实例的属性
    imageEditor.elements = {
        'backdrop': null,
        'editor': null,
        'resizeHandle': null,
        'cropSizeDisplay': null,
        'resizee': null,
        'resizeeCover': null,
        'cropArea': null,
        'resizeeClone': null,
        'cropResizeHandle': null,
        'saveHandle':null,
        'cancelHandle':null
    };
                    // 注册事件更新节点，样式等等
    imageEditor.load = function(W3CEvent) {
        var forms = pxg.getElementsByClassName('MY_ImageEditor', 'form');
        for( var i=0 ; i < forms.length ; i++ ) {
            var images = forms[i].getElementsByTagName('img');  // 相对条件下找到图
            if(!images[0]) {
                continue;
            }
            // 给图片注册imggeClick事件
            pxg.addEvent(images[0],'click',imageEditor.imageClick);
            ///修改类名（增加）
            forms[i].className += ' MY_ImageEditorModified';
        }
    };
          //移除编辑以及背景幕
    imageEditor.unload = function(W3CEvent) {
        document.body.removeChild(imageEditor.elements.editor);
        document.body.removeChild(imageEditor.elements.backdrop);
    };

    imageEditor.imageClick = function(W3CEvent) {
                      //新图可以自己自定义大小，，，不必改旧图
        var image = new Image();
        image.src = imageEditor.info.imgSrc = this.src;
        var windowSize = getWindowSize();
        /*
          分析裁剪板的结构
         <div>backdrop背景去</div>
         <div>
         <!-- editor编辑区 -->
         <div>resize handle</div>
         <img src="image.jpg">
         <div>translucent cover></div>
         <div>
         <!-- crop area裁剪区 -->
         <img src="image.jpg">
         <div>crop size display</div>
         <div>crop handle</div>
         <div>save handle</div>
         <div>cancel handle</div>
         </div>
         </div>
         */
        // 背景屏幕，全遮盖
        var backdrop = document.createElement('div');
        imageEditor.elements.backdrop = backdrop;
        pxg.setStyle(backdrop,{
            'position':'absolute',
            'background-color':'black',
            'opacity':'0.8',
            'width':'100%',
            'height':'100%',
            'z-index':10000,
            'filter':'alpha(opacity=80)'
        });
        setNumericStyle(backdrop,{
            'left':0,
            'top':0,
            'width':windowSize.width,
            'height':windowSize.height
        });
        document.body.appendChild(backdrop);
        // 创建编辑器editor
        var editor = document.createElement('div');
        imageEditor.elements.editor = editor;
        pxg.setStyle(editor,{
            'position':'absolute',
            'z-index':10001
        });
        setNumericStyle(editor,{
            'left': Math.ceil((windowSize.width-image.width)/2),   //屏幕中央
            'top': Math.ceil((windowSize.height-image.height)/2),
            'width':image.width,
            'height':image.height
        });

        document.body.appendChild(editor);
        // 创建缩放的那个手柄
        var resizeHandle = document.createElement('div');
        imageEditor.elements.resizeHandle = resizeHandle;
        pxg.setStyle(resizeHandle,{
            'position':'absolute',
            'background':'transparent url(../img/handles.gif) no-repeat 0 0'   });
        setNumericStyle(resizeHandle,{
            'left':(image.width - 18),
            'top':(image.height - 18),
            'width':28,
            'height':28
        });

        editor.appendChild(resizeHandle);
    // 创建可以缩放的图片
        var resizee = document.createElement('img');
        imageEditor.elements.resizee = resizee;
        resizee.src = imageEditor.info.imgSrc;

        pxg.setStyle(resizee,{
            'position':'absolute',
            'margin':0,
            'padding':0,
            'border':0
        });
        setNumericStyle(resizee,{
            'left':0,
            'top':0,
            'width':image.width,
            'height':image.height
        });
        editor.appendChild(resizee);
     // 创建一个半透明的蒙版方便比对
        var resizeeCover = document.createElement('div');
        imageEditor.elements.resizeeCover = resizeeCover;
        pxg.setStyle(resizeeCover,{
            'position':'absolute',
            'background-color':'black',
            'opacity':0.5,
            'filter':'alpha(opacity=50)'
        });
        setNumericStyle(resizeeCover,{
            'left':0,
            'top':0,
            'width':image.width,
            'height':image.height
        });
        editor.appendChild(resizeeCover);
    // 正式的裁剪区域的显示的那个地方
        var cropSizeDisplay = document.createElement('div');
        imageEditor.elements.cropSizeDisplay = cropSizeDisplay;
        pxg.setStyle(cropSizeDisplay,{
            'position':'absolute',
            'background-color':'black',
            'color':'white'
        });
        setNumericStyle(cropSizeDisplay,{
            'left':0,
            'top':0,
            'font-size':10,
            'line-height':10,
            'padding':4,
            'padding-right':4
        });
        cropSizeDisplay.appendChild(document.createTextNode('size'));
        // 创建裁剪容器
        var cropArea = document.createElement('div');
        imageEditor.elements.cropArea = cropArea;
        pxg.setStyle(cropArea,{
            'position':'absolute',
            'overflow':'hidden',
            'background-color':'transparent'
        });
        // 设置它的大小，更新显示盒子的大小
        setNumericStyle(cropArea,{
            'left':0,
            'top':0,
            'width':image.width,
            'height':image.height
        },true);
        editor.appendChild(cropArea);
        //  图像副本（克隆）
        var resizeeClone = resizee.cloneNode(false);
        imageEditor.elements.resizeeClone = resizeeClone;
        cropArea.appendChild(resizeeClone);
        cropArea.appendChild(cropSizeDisplay);
        // 创建缩放用的手柄
        var cropResizeHandle = document.createElement('div');
        imageEditor.elements.cropResizeHandle = cropResizeHandle;
        pxg.setStyle(cropResizeHandle,{
            'position':'absolute',
            'background':'transparent url(../img/handles.gif) no-repeat 0 0'
        });
        setNumericStyle(cropResizeHandle,{
            'right':0,
            'bottom':0,
            'width':18,
            'height':18
        });
        cropArea.appendChild(cropResizeHandle);
        // 创建保存手柄
        var saveHandle = document.createElement('div');
        imageEditor.elements.saveHandle = saveHandle;
        pxg.setStyle(saveHandle,{
            'position':'absolute',
            'background':'transparent url(../img/handles.gif) no-repeat -40px 0'
        });
        setNumericStyle(saveHandle,{
            'left':0,
            'bottom':0,
            'width':16,
            'height':18
        });
        cropArea.appendChild(saveHandle);
        // 创建取消缩放手柄
        var cancelHandle = document.createElement('div');
        imageEditor.elements.cancelHandle = cancelHandle;
        pxg.setStyle(cancelHandle,{
            'position':'absolute',
            'background':'transparent url(../img/handles.gif) no-repeat -29px -11px'
        });
        setNumericStyle(cancelHandle,{
            'right':0,
            'top':0,
            'width':18,
            'height':16
        });
        cropArea.appendChild(cancelHandle);
        // 添加事件侦听器
        //缩放
        pxg.addEvent(resizeHandle,'mouseover',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'0px -29px'});
        });
        pxg.addEvent(resizeHandle,'mouseout',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'0px 0px'});
        });
        // 裁剪
        pxg.addEvent(cropResizeHandle,'mouseover',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'0px -29px'});
        });
        pxg.addEvent(cropResizeHandle,'mouseout',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'0px 0px'});
        });
        // 保存
        pxg.addEvent(saveHandle,'mouseover',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'-40px -29px'});
        });
        pxg.addEvent(saveHandle,'mouseout',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'-40px 0px'});
        });
        // 取消
        pxg.addEvent(cancelHandle,'mouseover',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'-29px -40px'});
        });
        pxg.addEvent(cancelHandle,'mouseout',function(W3CEvent) {
            pxg.setStyle(this,{'background-position':'-29px -11px'});
        });
        /* Mouse events for the handles */
        // 图片缩放
        pxg.addEvent(resizeHandle,'mousedown',imageEditor.resizeMouseDown);
        // 裁剪拖动
        pxg.addEvent(cropArea,'mousedown',imageEditor.cropMouseDown);
        // 裁剪缩放
        pxg.addEvent(cropResizeHandle,'mousedown',function(W3CEvent) {
            imageEditor.info.resizeCropArea = true;
        });
        // 阻止保存手柄启动裁剪拖动
        pxg.addEvent(saveHandle,'mousedown',function(W3CEvent) {
            pxg.stopPropagation(W3CEvent);
        });
        // 保存图形，一时点击保存，二是双击
        pxg.addEvent(saveHandle,'click',imageEditor.saveClick);
        pxg.addEvent(cropArea,'dblclick',imageEditor.saveClick);
        // 阻止取消按钮启动
        pxg.addEvent(cancelHandle,'mousedown',function(W3CEvent) {
            pxg.stopPropagation(W3CEvent);
        });
        // 单击时取消改变
        pxg.addEvent(cancelHandle,'click',imageEditor.cancelClick);
        // 窗口大小改变则调整后面的屏的大小
        pxg.addEvent(window,'resize',function(W3CEvent) {
            var windowSize = getWindowSize();
            setNumericStyle(backdrop,{
                'left':0,
                'top':0,
                'width':windowSize.width,
                'height':windowSize.height
            });
        });
    };
 //  保存此时位置，尺寸
    imageEditor.resizeMouseDown = function(W3CEvent) {
        // Save the current positions and dimensions
        imageEditor.info.pointerStart = pxg.getPointerPositionInDocument(W3CEvent)
        imageEditor.info.resizeeStart = getDimensions(
            imageEditor.elements.resizee
        );
        imageEditor.info.cropAreaStart = getDimensions(
            imageEditor.elements.cropArea
        );
        // 注册事件来启用拖动（就是变换成了全局。。。）
        pxg.addEvent(document,'mousemove',imageEditor.resizeMouseMove);
        pxg.addEvent(document,'mouseup',imageEditor.resizeMouseUp);

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
   // 针对鼠标拖动的事件侦听器
    imageEditor.resizeMouseMove = function (W3CEvent) {
        var info = imageEditor.info;
       //取得鼠标的位置
        var pointer = pxg.getPointerPositionInDocument(W3CEvent);
        // 基于鼠标来计算图的新的宽度，高度
        var width = (info.resizeeStart.width+ pointer.x - info.pointerStart.x);
        var height = (info.resizeeStart.height+ pointer.y - info.pointerStart.y);
        // 限定一下最小的尺寸
        if(width < 42) { width = 42; }
        if(height < 42) { height = 42; }
        // 计算一下基于原始的百分比，后面方便宽高协调
        var widthPercent = (width / info.resizeeStart.width);
        var heightPercent = (height / info.resizeeStart.height);
        // 按下shift，按比例缩放
        if(pxg.getEventObject(W3CEvent).shiftKey) {
            if(widthPercent > heightPercent) {
                heightPercent = widthPercent;
                height = Math.ceil(info.resizeeStart.height * heightPercent);
            } else {
                widthPercent = heightPercent;
                width = Math.ceil(info.resizeeStart.width * widthPercent);
            }
        }
        // 计算裁剪区域的新的尺寸
        var cropWidth = Math.ceil(info.cropAreaStart.width * widthPercent);
        var cropHeight = Math.ceil(info.cropAreaStart.height * heightPercent);
        var cropLeft =  Math.ceil(info.cropAreaStart.left * widthPercent);
        var cropTop  =  Math.ceil(info.cropAreaStart.top * heightPercent);
        // 缩放对象，正好调整大小
        setNumericStyle(
            imageEditor.elements.resizee,
            {'width':width,'height':height}
        );
        setNumericStyle(
            imageEditor.elements.resizeeCover,
            {'width':width,'height':height}
        );
        setNumericStyle(
            imageEditor.elements.resizeHandle,
            {'left':(width - 18),'top':((height - 18))}
        );
        setNumericStyle(
            imageEditor.elements.cropArea,
            {'left':cropLeft,'top':cropTop,
                'width':cropWidth,'height':cropHeight},
            true
        );
        setNumericStyle(
            imageEditor.elements.resizeeClone,
            {'left':(cropLeft * -1),'top':(cropTop * -1),
                'width':width,'height':height}
        );

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
   // 移除拖动，本身（防止与其他混淆）事件侦听器
    imageEditor.resizeMouseUp = function (W3CEvent) {

        pxg.removeEvent(document,'mousemove',imageEditor.resizeMouseMove);
        pxg.removeEvent(document,'mouseup',imageEditor.resizeMouseUp);

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
// 裁剪的shi事件侦听器
    imageEditor.cropMouseDown = function(W3CEvent) {
        imageEditor.info.pointerStart = pxg.getPointerPositionInDocument(W3CEvent)
        imageEditor.info.cropAreaStart = getDimensions(
            imageEditor.elements.cropArea
        );
        // 包含缩放的区域的那个地方来限制裁剪区域的移动
        var resizeeStart = getDimensions(imageEditor.elements.resizee);
        imageEditor.info.maxX = resizeeStart.left + resizeeStart.width;
        imageEditor.info.maxY = resizeeStart.top + resizeeStart.height;
        pxg.addEvent(document,'mousemove', imageEditor.cropMouseMove);
        pxg.addEvent(document,'mouseup', imageEditor.cropMouseUp);

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
// 裁剪区域的拖动
    imageEditor.cropMouseMove = function(W3CEvent) {
        var pointer = pxg.getPointerPositionInDocument(W3CEvent);
        if(imageEditor.info.resizeCropArea) {
            //裁剪后的大小
            var width = ( imageEditor.info.cropAreaStart.width+ pointer.x - imageEditor.info.pointerStart.x);
            var height = ( imageEditor.info.cropAreaStart.height+ pointer.y - imageEditor.info.pointerStart.y);
            // 按下shift
            var widthPercent = (width / imageEditor.info.cropAreaStart.width);
            var heightPercent = (height / imageEditor.info.cropAreaStart.height);
            if(pxg.getEventObject(W3CEvent).shiftKey) {
                if(widthPercent > heightPercent) {
                    heightPercent = widthPercent;
                    height = Math.ceil(imageEditor.info.cropAreaStart.height * heightPercent);
                } else {
                    widthPercent = heightPercent;
                    width = Math.ceil(imageEditor.info.cropAreaStart.width* widthPercent);
                }
            }
           // 看是否超了边界
            if(imageEditor.info.cropAreaStart.left + width > imageEditor.info.maxX) {
                width = imageEditor.info.maxX- imageEditor.info.cropAreaStart.left;
            } else if(width < 36) {
                width = 36;
            }
            if(imageEditor.info.cropAreaStart.top + height > imageEditor.info.maxY) {
                height = imageEditor.info.maxY- imageEditor.info.cropAreaStart.top;
            } else if(height < 36) {
                height = 36;
            }
            setNumericStyle(
                imageEditor.elements.cropArea,
                {'width':width,'height':height}, true);
        } else {
            // 移动裁剪的区域
            var left = ( imageEditor.info.cropAreaStart.left+ pointer.x - imageEditor.info.pointerStart.x);
            var top = ( imageEditor.info.cropAreaStart.top+ pointer.y- imageEditor.info.pointerStart.y );
            // 判断越界情况
            var maxLeft = imageEditor.info.maxX- imageEditor.info.cropAreaStart.width;
            if(left < 0) { left = 0; }
            else if (left > maxLeft) { left = maxLeft;  }
            var maxTop = imageEditor.info.maxY - imageEditor.info.cropAreaStart.height;
            if(top < 0) { top = 0; }
            else if (top > maxTop) { top = maxTop;  }
            setNumericStyle(
                imageEditor.elements.cropArea,
                {'left':left,'top':top}
            );
            setNumericStyle(
                imageEditor.elements.resizeeClone,
                {'left':(left * -1),'top':(top * -1)}
            );
        }

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
// 移除裁剪事件跟本身
    imageEditor.cropMouseUp = function(W3CEvent) {
        // Remove all the events
        var eventObject = pxg.getEventObject(W3CEvent);
        imageEditor.info.resizeCropArea = false;
        pxg.removeEvent(document,'mousemove', imageEditor.cropMouseMove);
        pxg.removeEvent(document,'mouseup', imageEditor.cropMouseUp);

        pxg.stopPropagation(W3CEvent);
        pxg.preventDefault(W3CEvent);
    };
                                        //保存
    imageEditor.saveClick = function(W3CEvent) {
        alert('修改只将同步至服务器！');
        imageEditor.unload();
    };
                                        // 点击退出
    imageEditor.cancelClick = function(W3CEvent) {
        if(confirm('确定不保存修改?')) {
            imageEditor.unload();     // Unload the editor
        }
    };
    window['pxg']['imageEditor'] = imageEditor;
})();
// using the ADS.addLoadEvent()
// method because this page may contain a lot of images
pxg.addLoadEvent(pxg.imageEditor.load);
