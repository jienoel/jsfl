//导入所有图片，包含该fla的所有文件夹下的图片，保存图片的所有的链接信息
fl.outputPanel.clear()
var resourcePath = fl.browseForFolderURL("请选择素材路径：");
fl.outputPanel.trace("handle root :" + resourcePath);
var dom = fl.getDocumentDOM();
var lib = dom.library;
var activeItem;

//updateItems();
handlerFolder(resourcePath);
//deleteUnusedBitmap();
deleteTempFolder();
fl.outputPanel.trace("=============================finish========================================");
function deleteTempFolder()
{
	if(fl.getDocumentDOM().library.itemExists("Cj_temp"))
	{
		fl.trace("------------delete temp folder");
		fl.getDocumentDOM().library.deleteItem("Cj_temp");
	}
}

function updateItems()
{
	var items = fl.getDocumentDOM().library.items;
	for(var i in items)
	{
		var tempItem = items[i];
					if(tempItem.itemType == "bitmap" )
					{
						fl.getDocumentDOM().library.updateItem(tempItem.name);
						fl.trace("---->updateItem :"+tempItem.name);
					}
	}
}

function deleteUnusedBitmap()
{
var items = fl.getDocumentDOM().library.items;
fl.trace("start delete unusedItem:");
	for(var i in items)
	{
	
		var tempItem = items[i];
					if(tempItem.itemType == "bitmap" )
					{
						activeItem = tempItem;
						found = false;
						fl.trace("Searching for " + activeItem.name);
	
						//Scan the Main Timeline first
						scanTimeline(dom.getTimeline(), true);
						//Scan the Library
						scanLibrary();
	
	
					if (found == false) 
					{
							if (activeItem.linkageClassName != undefined) 
							{
								fl.trace("===================Item Not Found, But it does have a linkage so it may be instantianted dynamically. Use Caution before deleting.");
							}
							else 
							{
								fl.getDocumentDOM().library.deleteItem(tempItem.name);
								fl.trace("===================Item Not Found, Most likely safe to delete.");
							}
					}
	}
}
}

function scanTimeline(_timeLine, _mainTimeline) {

		var timeline = _timeLine;
		var layerCount = timeline.layerCount;
		
		while (layerCount--) {
			
			var frameCount = timeline.layers[layerCount].frameCount;
			
			while (frameCount--) {

					
					if( timeline.layers[layerCount].frames[frameCount] == undefined ) continue;
					
					var elems = timeline.layers[layerCount].frames[frameCount].elements;
					var p = elems.length;
					
					while(p--)
					{
						
						//ELEMENT Types
						//shape, text, instance, shapeObj
						
						//ITEM Types
						//undefined, component, movie clip, graphic, button, folder, font, sound, bitmap, compiled clip, screen, video
						
						//Check if it's an Instance in the Library
						if (elems[p].elementType == "instance") {
							//Check if it's the same clip as our the active check
							if (elems[p].libraryItem.name == activeItem.name) {
								found = true;
								var where;
								if (_mainTimeline == true) {
									where = "Located in Main Timeline";
								}
								else {
									where = "Located in Library Item: " + item.name;
								}
								fl.trace( "" );
								fl.trace("[FOUND " + activeItem.name + "]\n-" + where + "\n-On Layer: " + layerCount + "\n-On Frame: " + frameCount + "\nThis Item May be on other frames in this layer!");
								frameCount = 0;
							}	
						}
				}
			}
		}
}


function scanLibrary() {
	
	var items = lib.items;
	
	
	for (var i = 0; i < items.length; i++) {
		
		item = items[i];
		if (item.itemType == 'movie clip') {
			
			scanTimeline(item.timeline, false);
			
		}
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
				var newFolder = folderfileUri.substring(resourcePath.length + 1, folderfileUri.length);
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
				var hasLink = false;
				if(fl.getDocumentDOM().library.itemExists(tempName))
				{
				for(var k = 0; k<fl.getDocumentDOM().library.items.length;k++)
				{
					if(fl.getDocumentDOM().library.items[k].itemType == "bitmap" && fl.getDocumentDOM().library.items[k].name == tempName)
					{
						tempItem = fl.getDocumentDOM().library.items[k];
						break;
					}
				}
				}
				
				
				if(tempItem != null)
				{			
				linkageExportForAS = tempItem.linkageExportForAS;
				if(linkageExportForAS)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageExportForAS);
				}

					
				linkageExportForRS = tempItem.linkageExportForRS;
				if(linkageExportForRS)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageExportForRS);
				}
					
					
				linkageExportInFirstFrame = tempItem.linkageExportInFirstFrame;
				if(linkageExportInFirstFrame)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageExportInFirstFrame);
				}
					
				
				linkageIdentifier = tempItem.linkageIdentifier;
				if(linkageIdentifier)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageIdentifier);
				}

				
				linkageURL = tempItem.linkageURL;
				if(linkageURL)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageURL);
				}
					
				
				linkageImportForRS = tempItem.linkageImportForRS;
				if(linkageImportForRS)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageImportForRS);
				}

				
				linkageBaseClass = tempItem.linkageBaseClass;
				if(linkageBaseClass)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageBaseClass);
				}

				
					//AS链接名
				linkageClassName = tempItem.linkageClassName;
				if(linkageClassName)
				{
					hasLink = true;
					fl.trace("===>"+tempItem.linkageClassName);
				}

				fl.trace("Success______________________!");
				}
				else
				{
					fl.trace("Error can't find libarayItem "+tempName);
					continue;
				}
				
				
				
				
				if (newFolder) 
				{
				fl.getDocumentDOM().importFile(fileUri);
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
						fl.getDocumentDOM().importFile(fileUri);
						fl.getDocumentDOM().library.moveToFolder(tempPath,fileName,true);
						fileName = tempPath+"/"+fileName;
						fl.getDocumentDOM().library.moveToFolder("",fileName,true);
						fl.trace("==================finish"+tempName+"\n");
					}
					else
					{
						fl.getDocumentDOM().importFile(fileUri);
						continue;
					}
					
					
				}
				
				if(!hasLink)
				{
					continue;
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
