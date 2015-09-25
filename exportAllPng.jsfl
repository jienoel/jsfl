//导出某个文件夹里所有fla文件中的png图片
var folderURI = fl.browseForFolderURL("选择文件夹");
var fileMask = "*.fla";
var list = FLfile.listFolder(folderURI + "/" + fileMask, "files");
for(var j in list)
{
	var doc = fl.openDocument(folderURI + "/"+list[j]);
	var lib = doc.library;
	var flaName = doc.name;
	var flaDirName = flaName.substring(0, flaName.length - 4);
	var flaPath = doc.pathURI;
	fl.trace(flaPath);
	var flaPathFolder = flaPath.substring(0, flaPath.lastIndexOf("/"));
	var folderURL = flaPathFolder + "/" + flaDirName;  
	var libLength = lib.items.length;   
	var items=lib.items;  
	for(var i=0;i<libLength;i++)  
	{   
	    var item = lib.items[i];
	    itemName=item.name;
		if(item.itemType == "bitmap")
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
}