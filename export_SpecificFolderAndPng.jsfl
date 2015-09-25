//导出选定目录下的png图片
fl.outputPanel.clear()
var lib = fl.getDocumentDOM().library;
var flaName = fl.getDocumentDOM().name;
var flaDirName = flaName.substring(0, flaName.length - 4);
var flaPath = fl.getDocumentDOM().pathURI;
fl.trace(flaPath);
var flaPathFolder = flaPath.substring(0, flaPath.lastIndexOf("/"));
var folderURL = flaPathFolder + "/" + flaDirName;    
var items=lib.getSelectedItems(); 
var libLength = items.length;  
for(var i=0;i<libLength;i++)  
{   
    var item = items[i];
    itemName=item.name;
	fl.trace("itemName:"+itemName);
   if(item.itemType == "folder")
    	{
	    	var folderUrl = folderURL + "/" + item.name;
	        if(!FLfile.exists(folderUrl))
		{
			FLfile.createFolder(folderUrl);
		}
    	}else if(item.itemType == "bitmap")
    	{
    		imageURL = folderURL + "/" + itemName;
	        item.exportToFile(imageURL); 
	        fl.trace(imageURL);
    	} 
}
fl.trace("===============finish export ====================="); 