//导出除comps文件夹以外的所有png图片
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
    
    if(item.itemType == "bitmap" && itemName.indexOf("comps") == -1)
    {
	var folderUrl = folderURL + "/" + item.name.substring(0, item.name.lastIndexOf("/"));
	if(!FLfile.exists(folderUrl))
	{
		FLfile.createFolder(folderUrl);
	}

    	imageURL = folderURL + "/" + itemName;
	item.exportToFile(imageURL); 
	fl.trace(imageURL);
    }
} 