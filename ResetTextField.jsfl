//��ĳ���ļ���������fla�ļ��������޸���textfield������

//��fla�ļ�
var folderURL = fl.browseForFolderURL("ѡ���ļ���");
var fileMask = "*.fla";
var list = FLfile.listFolder(folderURL+ "/"+fileMask, "files");
var max = 1;

//�޸�����

var count = 0; //��������Ԫ������Ϊ [ MovieClip ��Button ��ͼ��] ��������Ҳ����Ҫ����������Ԫ������
var tfCount = 0;// ���������ı�������
var eachCount = 0;//��¼ÿһ��fla�Ŀ������Ԫ����������
var eachTfCount = 0;//��¼ÿһ��fla������ı�������
var replaceCount = 0; //��¼�����޸ĵ��ı�������
var isDeal = false;//�Ƿ�Ϊ�Ѿ��������Fla
var dealStr = '//deal:true';//�ڳ���1-�ͼ��д��Ľű�
//--------------------------------------------------
var undealFonts = ['Arial Unicode MS'];// Fla��Ҫ���������б�
var setFont = "Arial";// Ҫת��������  Verdana   Tahoma
var needDealFonts =['����','SimSun','����','΢���ź�'];
var isChange = true;//�Ƿ����ø�������
var unStatic_clearText = true;//�Ǿ�̬�ı�����ı�
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
    tips = " ���ȷ�������ı����壬���ȡ��ֻ��ӡ�ı������壡";
    isSet = confirm(tips);//����Ի���
    if(isSet)
        print("===================�޸�===================");
    else
        print("===================��ӡ===================");
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

//����SWF
function exportSwf(name)  
{  
    print("export swf:"+name);
    fl.getDocumentDOM().setPlayerVersion(10); 
    fl.getDocumentDOM().exportSWF(name, true);
    fl.getDocumentDOM().save(); 
     
}  

//-����fla�����޸�����
function main()
{
    checkDeal(0);
    var tips = "";
    if(isDeal){
        tips = "\n\t���ļ�֮ǰ�Ѿ��������ˣ�\nҪ���·���ȫ���ı���,���ȷ��";
    }else{
        tips = "\n���ٴ�ȷ���Ƿ����ȫ���ı���\n���ȷ��";
    }
    if(isChange){
        tips = tips + "������һ��.";
        tips = tips + "\n\n   �������幦�� - ����״̬ :" + isChange + "  ";
        tips = tips + "\n\n  ��ȷ������һ������\n  ��ȡ�����˳�������";
    }else{
        tips = tips + "ֱ�ӷ���.\n\n����Ϊ��ʹ���豸���塿����Ӧ���������ı���!";
        tips = tips + "\n\n   �������幦�� - ����״̬ :" + isChange;
        tips = tips + "\n\n  ��ȷ��������\n  ��ȡ�����˳�������";
    }
    //var flag = confirm(tips);//����Ի���
    flag = true;
    if(!flag) return;
    if(isChange){
        tips = "\n����Ϊ��ʹ���豸���塿����Ӧ���������ı���!\n\n�Ƿ�ͬʱ���ø������幦��,"+
                  "����������Ϊ: " + setFont + "     ";
        tips = tips + "\n\n   �Ǿ�̬�ı�����ı����� - ����״̬ : " + unStatic_clearText;
        tips = tips + "\n\n   ���ø������幦�ܺ�Ҫ�����������б�: \n          " + undealFonts.join(',\n        ');
        tips = tips + "\n\n  ��ȷ�������ø�������\n  ��ȡ���������ø�������";
        //isChange = confirm(tips);
        isChange = true;
    }
    //1-������̨
    fl.trace("===============>>������̨");
    recursion(fl.getDocumentDOM().getTimeline());
    //2-������
    var library = fl.getDocumentDOM().library;
    var libItems = library.items;
    fl.trace("===============>>������");
 
    for(var i=0;i< libItems.length ;i++)
    {
        var item = libItems[i];
        //�����Ԫ��
        if(item.itemType == 'movie clip' || item.itemType == 'button'|| item.itemType == 'graphic')
        {
            count ++;
            eachCount++;
            library.selectNone();//ȡ�����б�ѡ��״̬
            library.selectItem(item.name);//ѡ��ָ����Ŀ
            fl.getDocumentDOM().library.editItem();//����Ԫ���ڲ�
            fl.trace("\n-->>Edit:" + item.name);
            recursion(fl.getDocumentDOM().getTimeline());//3-����Ԫ���ڲ�
            fl.trace("--<<End Edit:" + item.name);
            fl.getDocumentDOM().selectNone();
            //�˳�Ԫ���༭ģʽ���������㷵�ر༭ģʽ����һ����
            //���磬�������������Ԫ���б༭һ��Ԫ����
            //��˷���ʹ�������ڱ༭��Ԫ������һ�����뵽��Ԫ���С�
            fl.getDocumentDOM().exitEditMode();
        }
    }
    checkDeal(1);
    fl.trace("<<=====END=======���й���Ԫ����" + eachCount + " �ı����У�" + eachTfCount);
}
 
//-���д��ע��֡�ű�����¼��״̬
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
            if(frame0)//����1���ڵ�һ֡
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
 
//-����Ƿ���Ҫ����������
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

 
//-��������
function changeProperty(element)
{
    tfCount++;
    eachTfCount++;
    //ָ���ı����ַ�ʽ
    //device ʹ���豸����
    //bitmap ʹ�ô���ݵ��ı�����Ϊλͼ���������������
    //standard ��Flash MX 2004ʹ�õı�׼������ݵķ����������ı�
    //�������ڶ����ı��������ı�����б�ı����������
    //advanced ʹ����Flash 8��ʵ�ֵĸ߼��������������ּ����������ı���
    //�������� ��ø��õ��������Ч������߿ɶ��ԣ������Ƕ�С���ı��������
    //customThicknesssSharpness ������ʹ��Flash 8��ʵ�ֵĸ߼��������������ּ���ʱ��
    //ָ���ı������Ⱥʹ�ϸ���Զ������á�
    element.fontRenderingMode = 'advanced';
    //�Ǿ�̬�ı�����ı�����
    
	 var x = 0;
	 var y = 0;
	 var width = 0;
	 var height = 0;
	 
	x = element. x;
	y = element.y;
	width = element.width;
	height = element.height;
	
   if(unStatic_clearText){
    //һ���ַ�������ָʾ�ı��ֶε����͡��ɽ��ܵ�ֵΪ"static"��"dynamic"�Լ�"input"
        if(element.textType != 'static'){
            element.setTextString("");
       }
    }
    //δ���������������
    if(!isChange)return;
     
	
		
	//��Ҫ�滻������
	if(isUnchange(needDealFonts, element.getTextAttr('face'))){
		
		print("name:"+element.name+"  x:"+x+"  y:"+y+"  width:"+width+"   height:"+height);
        fl.trace("- - - - �滻���壺" + element.getTextAttr('face'));
		element.setTextAttr('face',setFont);//ָ������ 
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
 
//-����ʱ����
function recursion(timeLine)//���뵱ǰ���ʱ����
{
    //fl.trace("------------------recursion()");
    //fl.trace("  ʱ����:" + timeLine.name);
    for( var i=0 ; i<timeLine.layers.length ; i++)//��������ͼ��
    {
        var layer = timeLine.layers[i];
        var isPrint = false;
        layer.locked = false;//����
        layer.visible = true;//����
        timeLine.currentLayer = i;
        var layFrames = layer.frames;
        var Tips = "    ͼ��:" + layer.name;
        Tips = Tips + "\n      |-----currentLayer:" + timeLine.currentLayer;
        for(var k=0 ; k<layFrames.length ; k++)//�������е�����֡
        {
            var frame = layFrames[k];
            if(k == frame.startFrame)//�ǹؼ�֡
            {
                timeLine.currentFrame = k;//����ͷ�Ƶ��ؼ�֡
                
                var fraElements =  frame.elements;
                isPrint = gotoCheck(fraElements) || isPrint;
                if(isPrint)
                {
                    Tips = Tips + "\n        -----currentFrame:" + timeLine.currentFrame;
                    Tips = Tips + "        �ؼ�֡:" + (k + 1) + " -Ԫ�ظ���:" + fraElements.length;            
                }
            }
            //���ǹؼ�֡
        }
        if(isPrint)
        {
            print(Tips);
        }
        //layer.locked = true; //�������Ҫ��Ҫ����ͼ��
    }
}
 
//-�����ڲ�Ԫ��
function gotoCheck(elements)
{
   // fl.trace("          --gotoCheck()" + elements.length);
    var result = false;
    for( var i=0 ; i<elements.length ; i++)//��������ڲ�Ԫ��
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
            if(element.isGroup)//��һ�����
            {
                //fl.trace("            һ�����");
                element.selected = true;
                //�����������л����ɴ˲���ָ���ı༭ģʽ��
                //���δָ���κβ�������˷���Ĭ��ΪԪ���༭ģʽ��
                //�����Ҽ�����Ԫ�����������Ĳ˵���ѡ�񡰱༭���Ľ��һ����

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
            //fl.trace("            --�ǿ��е�Ԫ����" + element.name);
        }else{
            //fl.trace("::::������Ԫ������--" + element.elementType);
        }
    }
    return result;
}


//�������ܺ���
function print(_message)
{
  fl.trace(_message);
}

//����log��File��
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