//导出image目录下的png图片
var lib = fl.getDocumentDOM().library;
var flaName = fl.getDocumentDOM().name;
var flaDirName = flaName.substring(0, flaName.length - 4);
var flaPath = fl.getDocumentDOM().pathURI;
fl.trace(flaPath);
var flaPathFolder = flaPath.substring(0, flaPath.lastIndexOf("/"));
var folderURL = flaPathFolder + "/" + flaDirName;  
var libLength = lib.items.length;   
var items=lib.items;  
for(var i=0;i<libLength;i++)  
{   
    var item = lib.items[i];
    itemName=item.name;
    var index = itemName.indexOf("image");
    if(index == 0)  
    {   
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
} 