//打开某个文件夹里所有fla文件，并且修改其textfield的字体

//打开fla文件
var folderURL = fl.browseForFolderURL("选择文件夹");
var fileMask = "*.fla";
var list = FLfile.listFolder(folderURL+ "/"+fileMask, "files");
var max = 1;

//修改字体

var count = 0; //库中所有元件类型为 [ MovieClip 、Button 、图形] 的数量，也就是要遍历的所有元件数量
var tfCount = 0;// 记数所有文本框数量
var eachCount = 0;//记录每一个fla的库里面的元件类型数量
var eachTfCount = 0;//记录每一个fla里面的文本框数量
var replaceCount = 0; //记录所有修改的文本框数量
var isDeal = false;//是否为已经处理过的Fla
var dealStr = '//deal:true';//在场景1-最顶图层写入的脚本
//--------------------------------------------------
var undealFonts = ['Arial Unicode MS'];// Fla中要保留字体列表
var setFont = "Arial";// 要转换的字体  Verdana   Tahoma
var needDealFonts =['宋体','SimSun','黑体','微软雅黑'];
var isChange = true;//是否启用更改字体
var unStatic_clearText = true;//非静态文本清空文本
var isSet = false;
//------------------------------dictionary----------------
var keys = new Array(100);
var values =new Array(100);
//---------------------------------------start ---------------------------

fl.outputPanel.clear();

print("debug");

openFile();

function chooseFunction()
{
    var tips = "";
    tips = " 点击确定更改文本字体，点击取消只打印文本的字体！";
    isSet = confirm(tips);//警告对话框
    if(isSet)
        print("===================修改===================");
    else
        print("===================打印===================");
}

function openFile()
{
 print("folderURL: " + folderURL);
 print("list lengtn: " + list.length );
 chooseFunction();
  for(var i in list)
  {
     //print(list[i]);
    // if(list[i] == "battleLandRule_en.fla")
     // {
        eachCount = 0;
        eachTfCount = 0;
        var fla = fl.openDocument(folderURL + "/"+list[i]);
        print("fla :"+fla.name);
        main();
        fla.save();
		if(replaceCount>0)
		{
			swfName = folderURL +"/"+list[i].split('.')[0]+'.swf';
			exportSwf(swfName);
		}
        //fl.closeDocument(fl.getDocumentDOM(), false);
        fla.close();
        print("\n------------------------------------------------------------------------------------------------")
     // }
        
  }
	PrintKeyValue();
  print("==========================Finish====Count:"+count+"  tfCount:"+tfCount+"================replaceCount:"+replaceCount);
  LogToFile();

}

function PrintKeyValue()
{
    for(var i = 0; i<keys.length;i++)
    {
        if(keys[i] != null)
            print("\n font:"+keys[i]+" : "+values[i]);
    }
}

//导出SWF
function exportSwf(name)  
{  
    print("export swf:"+name);
    fl.getDocumentDOM().setPlayerVersion(10); 
    fl.getDocumentDOM().exportSWF(name, true);
    fl.getDocumentDOM().save(); 
     
}  

//-遍历fla并且修改字体
function main()
{
    checkDeal(0);
    var tips = "";
    if(isDeal){
        tips = "\n\t该文件之前已经分析过了！\n要重新分析全部文本框,点击确定";
    }else{
        tips = "\n请再次确认是否分析全部文本框！\n点击确定";
    }
    if(isChange){
        tips = tips + "进入下一步.";
        tips = tips + "\n\n   更改字体功能 - 开关状态 :" + isChange + "  ";
        tips = tips + "\n\n  【确定】下一步设置\n  【取消】退出不分析";
    }else{
        tips = tips + "直接分析.\n\n设置为【使用设备字体】将会应用于所有文本框!";
        tips = tips + "\n\n   更改字体功能 - 开关状态 :" + isChange;
        tips = tips + "\n\n  【确定】分析\n  【取消】退出不分析";
    }
    //var flag = confirm(tips);//警告对话框
    flag = true;
    if(!flag) return;
    if(isChange){
        tips = "\n设置为【使用设备字体】将会应用于所有文本框!\n\n是否同时启用更改字体功能,"+
                  "将字体设置为: " + setFont + "     ";
        tips = tips + "\n\n   非静态文本清空文本内容 - 开关状态 : " + unStatic_clearText;
        tips = tips + "\n\n   启用更改字体功能后要保留的字体列表: \n          " + undealFonts.join(',\n        ');
        tips = tips + "\n\n  【确定】启用更改字体\n  【取消】不启用更改字体";
        //isChange = confirm(tips);
        isChange = true;
    }
    //1-操作舞台
    fl.trace("===============>>操作舞台");
    recursion(fl.getDocumentDOM().getTimeline());
    //2-操作库
    var library = fl.getDocumentDOM().library;
    var libItems = library.items;
    fl.trace("===============>>操作库");
 
    for(var i=0;i< libItems.length ;i++)
    {
        var item = libItems[i];
        //如果是元件
        if(item.itemType == 'movie clip' || item.itemType == 'button'|| item.itemType == 'graphic')
        {
            count ++;
            eachCount++;
            library.selectNone();//取消所有被选中状态
            library.selectItem(item.name);//选中指定项目
            fl.getDocumentDOM().library.editItem();//进入元件内部
            fl.trace("\n-->>Edit:" + item.name);
            recursion(fl.getDocumentDOM().getTimeline());//3-操作元件内部
            fl.trace("--<<End Edit:" + item.name);
            fl.getDocumentDOM().selectNone();
            //退出元件编辑模式，并将焦点返回编辑模式的上一级。
            //例如，如果您正在其它元件中编辑一个元件，
            //则此方法使您从正在编辑的元件向上一级进入到父元件中。
            fl.getDocumentDOM().exitEditMode();
        }
    }
    checkDeal(1);
    fl.trace("<<=====END=======库中共有元件：" + eachCount + " 文本框共有：" + eachTfCount);
}
 
//-这个写个注释帧脚本标记下检测状态
function checkDeal(step)
{
    fl.getDocumentDOM().editScene(0);
    var timeLine0 = fl.getDocumentDOM().getTimeline();
    timeLine0.currentLayer = 0;
    var layer0 = timeLine0.layers[0];
    var frame0 = layer0.frames[0];
    if(!step)
    {
        isDeal = false;
        if(frame0 && frame0.actionScript == dealStr){
            isDeal = true;
        }
    }else
    {
        if(!isDeal)
        {
            if(frame0)//场景1存在第一帧
            {
                if(frame0.actionScript != dealStr){
                    timeLine0.addNewLayer('asDeal','normal',true);
                }else{ return; }
            }else{
                timeLine0.insertBlankKeyframe(0);
            }
            timeLine0.currentLayer = 0;
            layer0 = timeLine0.layers[0];
            layer0.name = 'asDeal';
            timeLine0.removeFrames(1,layer0.frames.length);
            timeLine0.currentFrame = 0;
            frame0 = layer0.frames[0];
            if(frame0){frame0.actionScript = dealStr;}
        }
    }
}
 
//-检测是否是要保留的字体
function isUnchange(arr,str)
{
    if(!arr || !str) return false;
    for(var u = 0; u<arr.length; u++)
    {
        if(arr[u] == str)
        {
          print("=================================>unChange  "+str);
          return true; 
        }
    }
    return false;
}
 
function PrintProperty(element)
{

    if(!isSet)
	{
	tfCount++;
    eachTfCount++;
	}
    var fontAttr = element.getTextAttr('face');
    print("----font:"+fontAttr); 
	SetKey(fontAttr);
}

function SetKey(key)
 {
    var contained = false;
    for(var i = 0; i<keys.length;i++)
    {
        if(keys[i] == key)
        {
            values[i]++;
            contained = true;
            break;
        }
    }
    if(!contained)
    {
        keys.push(key);
        values.push(1);
    }
 }

 
//-设置字体
function changeProperty(element)
{
    tfCount++;
    eachTfCount++;
    //指定文本呈现方式
    //device 使用设备字体
    //bitmap 使用带锯齿的文本呈现为位图或像素字体的样子
    //standard 用Flash MX 2004使用的标准消除锯齿的方法来呈现文本
    //这是用于动画文本、大型文本或倾斜文本的最佳设置
    //advanced 使用在Flash 8中实现的高级消除锯齿字体呈现技术来呈现文本，
    //这样可以 获得更好的消除锯齿效果并提高可读性，尤其是对小型文本更是如此
    //customThicknesssSharpness 用于在使用Flash 8中实现的高级消除锯齿字体呈现技术时，
    //指定文本清晰度和粗细的自定义设置。
    element.fontRenderingMode = 'advanced';
    //非静态文本清空文本内容
    
	 var x = 0;
	 var y = 0;
	 var width = 0;
	 var height = 0;
	 
	x = element. x;
	y = element.y;
	width = element.width;
	height = element.height;
	
   if(unStatic_clearText){
    //一个字符串，它指示文本字段的类型。可接受的值为"static"、"dynamic"以及"input"
        if(element.textType != 'static'){
            element.setTextString("");
       }
    }
    //未开启字体更换功能
    if(!isChange)return;
     
	
		
	//需要替换的字体
	if(isUnchange(needDealFonts, element.getTextAttr('face'))){
		
		print("name:"+element.name+"  x:"+x+"  y:"+y+"  width:"+width+"   height:"+height);
        fl.trace("- - - - 替换字体：" + element.getTextAttr('face'));
		element.setTextAttr('face',setFont);//指定字体 
		element.x = x;
		element.y = y;
		element.width = width;
		element.height = height;
		print("name:"+element.name+"  x:"+element.x+"  y:"+element.y+"  width:"+element.width+"   height:"+element.height);
    }
    replaceCount++;
    
    //if(false && 'Verdana' == setFont)
    //{
      //  element.setTextAttr('letterSpacing',-1);
      //  var size = parseInt(element.getTextAttr('size'));
      //  if(size > 11) element.setTextAttr('size',size-1);
    //}
}
 
//-遍历时间轴
function recursion(timeLine)//传入当前活动的时间轴
{
    //fl.trace("------------------recursion()");
    //fl.trace("  时间轴:" + timeLine.name);
    for( var i=0 ; i<timeLine.layers.length ; i++)//遍历所有图层
    {
        var layer = timeLine.layers[i];
        var isPrint = false;
        layer.locked = false;//解锁
        layer.visible = true;//可视
        timeLine.currentLayer = i;
        var layFrames = layer.frames;
        var Tips = "    图层:" + layer.name;
        Tips = Tips + "\n      |-----currentLayer:" + timeLine.currentLayer;
        for(var k=0 ; k<layFrames.length ; k++)//遍历层中的所有帧
        {
            var frame = layFrames[k];
            if(k == frame.startFrame)//是关键帧
            {
                timeLine.currentFrame = k;//播放头移到关键帧
                
                var fraElements =  frame.elements;
                isPrint = gotoCheck(fraElements) || isPrint;
                if(isPrint)
                {
                    Tips = Tips + "\n        -----currentFrame:" + timeLine.currentFrame;
                    Tips = Tips + "        关键帧:" + (k + 1) + " -元素个数:" + fraElements.length;            
                }
            }
            //不是关键帧
        }
        if(isPrint)
        {
            print(Tips);
        }
        //layer.locked = true; //遍历完后要不要锁上图层
    }
}
 
//-遍历内部元素
function gotoCheck(elements)
{
   // fl.trace("          --gotoCheck()" + elements.length);
    var result = false;
    for( var i=0 ; i<elements.length ; i++)//遍历组合内部元素
    {
        var element = elements[i];
        element.locked = false;
        fl.getDocumentDOM().selectNone();
        
        if(element.elementType == 'text')
        {
            print("**********element name :"+element.name + " type:"+ element.elementType);
			PrintProperty(element);
			if(isSet)
			{
				changeProperty(element);
			}			
            result = true;
        }
        else if(element.elementType == 'shape')
        {
            if(element.isGroup)//是一个组合
            {
                //fl.trace("            一个组合");
                element.selected = true;
                //将创作工具切换到由此参数指定的编辑模式。
                //如果未指定任何参数，则此方法默认为元件编辑模式，
                //这与右键单击元件调用上下文菜单并选择“编辑”的结果一样。

				//fl.getDocumentDOM().enterEditMode();
				//fl.getDocumentDOM().selectAll();
				//gotoCheck(fl.getDocumentDOM().selection);
				//fl.getDocumentDOM().selectNone();
				//fl.getDocumentDOM().exitEditMode();
					
				gotoCheck(element.members);
            }
            element.selected = false;
        }else if(element.elementType == 'instance')
        {
            //fl.trace("            --是库中的元件：" + element.name);
        }else{
            //fl.trace("::::有其它元素类型--" + element.elementType);
        }
    }
    return result;
}


//辅助功能函数
function print(_message)
{
  fl.trace(_message);
}

//操作log到File中
function LogToFile()
{
    var today=new Date(); 
    var h=today.getHours(); 
    var m=today.getMinutes(); 
    var s=today.getSeconds(); 
    //add a zero in front of number<10 
    m=checkTime(m); 
    s=checkTime(s); 

    var logName = h+"_"+m+"_"+s+".txt";

    // Save log
    fl.outputPanel.save(folderURL+'/logs/'+logName, false);
}

function checkTime(i) 
{ 
if (i<10) 
{ 
i="0"+i; 
} 
return i; 
} 