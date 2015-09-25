//重新导入某个特定文件夹的图片
fl.outputPanel.clear()
var resourcePath = fl.browseForFolderURL("请选择素材路径：");
fl.outputPanel.trace("handle root :" + resourcePath);
var lib = fl.getDocumentDOM().library;
var flaName = fl.getDocumentDOM().name;
var flaDirName = flaName.substring(0, flaName.length - 4);
var flaPath = fl.getDocumentDOM().pathURI;
fl.trace(flaPath);
var flaPathFolder = flaPath.substring(0, flaPath.lastIndexOf("/"));
var folderURL = flaPathFolder + "/" + flaDirName;  
fl.trace("=======================>folderURL:"+folderURL);

handlerFolder(resourcePath);
deleteTempFolder();

function deleteTempFolder()
{
	if(fl.getDocumentDOM().library.itemExists("Cj_temp"))
	{
		fl.trace("------------delete temp folder");
		fl.getDocumentDOM().library.deleteItem("Cj_temp");
	}
}

function handlerFolder(folderfileUri) {
	var fileList = FLfile.listFolder(folderfileUri);
	for (var i = 0; i < fileList.length; i++) {
		var fileName = fileList[i];
		var fileUri = folderfileUri + "/" + fileName;
		var attr = FLfile.getAttributes(fileUri);
		fl.outputPanel.trace(fileUri + ":" + attr);
		if (attr == "D") {	//folder
			fl.outputPanel.trace("handle folder " + fileUri);
			handlerFolder(fileUri);
		} else {	//file
			fl.outputPanel.trace("import file " + fileUri);
			var ind = fileName.lastIndexOf(".");
			var ext = fileName.substring(ind+1,fileName.length);
			ext = ext.toLowerCase();
			if(ext !="bmp" && ext!="gif" && ext != "jpg" && ext != "jpeg" && ext != "png")
			{
				fl.outputPanel.trace("===============================================================> " + ext+"    index:"+ind +"   length:"+fileName.length);
			}
			else
			{
				
				//fl.trace("======>"+fileName);
				var newFolder = folderfileUri.substring(folderURL.length + 1, folderfileUri.length);
				fl.trace("========>newFolder:"+newFolder);
				var tempName = fileName;
				if(newFolder)
				{
					tempName = newFolder+"/"+fileName;
				}
				fl.trace("======>"+tempName);
				var tempItem = null;
				var duplicateName;
				var duplicateSuccess = false;
				var linkageClassName;
				var linkageExportForAS;
				var linkageExportForRS;
				var linkageExportInFirstFrame;
				var linkageIdentifier;
				var linkageURL;
				var linkageImportForRS;
				var linkageBaseClass;
				
				for(var k = 0; k<fl.getDocumentDOM().library.items.length;k++)
				{
					if(fl.getDocumentDOM().library.items[k].itemType == "bitmap" && fl.getDocumentDOM().library.items[k].name == tempName)
					{
						tempItem = fl.getDocumentDOM().library.items[k];
						break;
					}
				}
				
				if(tempItem != null)
				{			
				linkageExportForAS = tempItem.linkageExportForAS;
				if(linkageExportForAS)
					fl.trace("===>"+tempItem.linkageExportForAS);
					
				linkageExportForRS = tempItem.linkageExportForRS;
				if(linkageExportForRS)
					fl.trace("===>"+tempItem.linkageExportForRS);
					
				linkageExportInFirstFrame = tempItem.linkageExportInFirstFrame;
				if(linkageExportInFirstFrame)
					fl.trace("===>"+tempItem.linkageExportInFirstFrame);
				
				linkageIdentifier = tempItem.linkageIdentifier;
				if(linkageIdentifier)
					fl.trace("===>"+tempItem.linkageIdentifier);
				
				linkageURL = tempItem.linkageURL;
				if(linkageURL)
					fl.trace("===>"+tempItem.linkageURL);
				
				linkageImportForRS = tempItem.linkageImportForRS;
				if(linkageImportForRS)
					fl.trace("===>"+tempItem.linkageImportForRS);
				
				linkageBaseClass = tempItem.linkageBaseClass;
				if(linkageBaseClass)
					fl.trace("===>"+tempItem.linkageBaseClass);
				
					//AS链接名
				linkageClassName = tempItem.linkageClassName;
				if(linkageClassName)
					fl.trace("===>"+tempItem.linkageClassName);
				fl.trace("Success______________________!");
				}
				else
				{
					fl.trace("Error can't find libarayItem "+tempName);
					continue;
				}
				
				
				
				
				if (newFolder) 
				{
				fl.getDocumentDOM().importFile(fileUri,true);
				fl.outputPanel.trace("create folder " + newFolder);
				fl.getDocumentDOM().library.newFolder(newFolder);
				fl.getDocumentDOM().library.moveToFolder(newFolder, fileName, true);
				}
				else
				{
					if(tempItem!=null)
					{
						var tempPath = "Cj_temp";
						fl.getDocumentDOM().library.newFolder(tempPath);
						fl.getDocumentDOM().library.moveToFolder(tempPath,tempName,true);
						fl.getDocumentDOM().importFile(fileUri,true);
						fl.getDocumentDOM().library.moveToFolder(tempPath,fileName,true);
						fileName = tempPath+"/"+fileName;
						fl.getDocumentDOM().library.moveToFolder("",fileName,true);
						fl.trace("==================finish"+tempName+"\n");
					}
					else
					{
						fl.getDocumentDOM().importFile(fileUri,true);
						continue;
					}
					
					
				}
				
				tempItem = null;
				for(var k = 0; k<fl.getDocumentDOM().library.items.length;k++)
				{
					if(fl.getDocumentDOM().library.items[k].itemType == "bitmap" && fl.getDocumentDOM().library.items[k].name == tempName)
					{
						tempItem = fl.getDocumentDOM().library.items[k];
						break;
					}
				}
				if(tempItem !=null)
					{
						fl.trace("start copy___________________________!");
							
						if(linkageExportForAS)
						{
							fl.trace(tempItem.linkageExportForAS+" linkageExportForAS===>"+tempItem.linkageExportForAS);
							tempItem.linkageExportForAS = linkageExportForAS;
						}
							
						tempItem.linkageExportForRS = false;
						if(linkageExportForRS)
						{
							fl.trace(tempItem.linkageExportForRS+" linkageExportForRS===>"+tempItem.linkageExportForRS);
							tempItem.linkageExportForRS = linkageExportForRS;
						}
						
						if(linkageExportInFirstFrame)
						{
							fl.trace(tempItem.linkageExportInFirstFrame+" linkageExportInFirstFrame===>"+tempItem.linkageExportInFirstFrame);
							tempItem.linkageExportInFirstFrame = linkageExportInFirstFrame;
						}
						
						if(linkageIdentifier)
						{
							fl.trace(tempItem.linkageIdentifier+" linkageIdentifier===>"+tempItem.linkageIdentifier);
							tempItem.linkageIdentifier = linkageIdentifier;
						}
						
						if(linkageURL)
						{
							fl.trace(tempItem.linkageURL+" linkageURL===>"+tempItem.linkageURL);
							tempItem.linkageURL = linkageURL;
						}
						
						if(linkageImportForRS)
						{
							fl.trace(tempItem.linkageImportForRS+" linkageImportForRS===>"+tempItem.linkageImportForRS);
							tempItem.linkageImportForRS = false;
						}
						
						if(linkageBaseClass)
						{
							fl.trace(tempItem.linkageBaseClass+" linkageBaseClass===>"+tempItem.linkageBaseClass);
							tempItem.linkageBaseClass = linkageBaseClass;
						}
							
						if(linkageClassName)
						{
							fl.trace(tempItem.linkageClassName+" linkageClassName===>"+tempItem.linkageClassName);
							fl.trace(tempItem.linkageClassName+" linkageClassName===>"+tempItem.linkageClassName);
							tempItem.linkageClassName = linkageClassName;
						}
						fl.trace("Copy Success______________________!");
					}
				
				fl.trace("==================finish"+tempName+"\n");
			}
			
		}
	}
}
