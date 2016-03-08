// This script has been tested on Adobe Photoshop CS3 and above
#target photoshop

var source = null;
var destination = null;
var sourceFiles = null;

// Default maximum height, width, and resolution at the Cal Poly VRC
var maxHeight = 1875;
var maxWidth = 1875;
var dpi = 150;

/*
	VARIABLE NAME: main
	DESCRIPTION: The variable main specifies the graphical user interface
		and what it should look like inside Adobe Photoshop.
*/
try{
	var main =
		"dialog {\
			text: 'Batch Resizing Images to JPEG', \
			orientation: 'column', \
			alignChildren: 'center', \
			source: Group {\
				s: StaticText { text: 'Step 1: Choose your source folder' }, \
				b: Button { text: 'Select Folder ...'} \
			}, \
			sourceLabel: StaticText { text: 'No source folder selected', justify: 'center', preferredSize: [300, 20]}, \
			destination: Group {\
				s: StaticText { text: 'Step 2: Choose your destination folder' }, \
				b: Button { text: 'Select Folder ...'} \
			}, \
			destinationLabel: StaticText { text: 'No destination folder selected', justify: 'center', preferredSize: [300, 20]}, \
			maxHeight: Group {\
				s: StaticText { text: 'Step 3: What is your maximum height (in pixels)?' }, \
				t: EditText { preferredSize: [50, 20], text: '2100', justify: 'right'} \
			}, \
			maxWidth: Group {\
				s: StaticText { text: 'Step 4: What is your maximum width (in pixels)?' }, \
				t: EditText { preferredSize: [50, 20], text: '2100', justify: 'right'} \
			}, \
			resolution: Group {\
				s: StaticText { text: 'Step 5: What is your specified resolution (in dpi)?' }, \
				t: EditText { preferredSize: [50, 20], text: '150', justify: 'right'} \
			}, \
			jpegQuality: Group { \
				s: StaticText { text: 'Step 6: What is your JPEG image quality?' }, \
				p: DropDownList { justify: 'right'} \
			},\
			buttonGroup: Group {\
				ok: Button { text: 'OK'},\
				cancel: Button { text: 'Cancel', properties: {name: 'cancel'}},\
			},\
			copyright1: StaticText { text: '© 2009 John Huan Vu under the direction of Sheryl Frisch, Visual Resources Center'}, \
			copyright2: StaticText { text: 'Department of Art and Design, California Polytechnic State University, San Luis Obispo'} \
		}";
	var dlg = new Window(main);
} catch(e) {
	writeToError("main", e);
}

/*
	VARIABLE NAME: jpegQuality
	DESCRIPTION: The variable jpegQuality specifies the quality in which the image can be saved
		as. The categories within the array is populated in the pull-down menu.
*/
try{
	var jpegQuality = new Array(
		"12 (Max)", "11", "10",
		"9  (High)", "8",
		"7  (Medium)", "6", "5",
		"4  (Low)", "3", "2", "1", "0"		
	);
	for(var i=0; i < jpegQuality.length; i++){
		dlg.jpegQuality.p.add('item', jpegQuality[i]);
	}
	dlg.jpegQuality.p.selection = 2;
} catch(e) {
	writeToError("jpegQuality", e);
}

/*
	EVENT NAME: dlg.source.b.onClick
	DESCRIPTION: 
		The function is called when the user press the source button. The function
		prompts the user to specify the source folder and upate the source label with the
		corresponding source folder path. The function retrieves all supporting files
		from the folder and place into the sourceFiles array.
*/
try{
	dlg.source.b.onClick = function(){
		source = Folder.selectDialog("Select your source folder in which you like to resize.");
		if(!source) { source = null; return; }
		destination = source;
		dlg.sourceLabel.text = "Source Folder: " + source.name;
		dlg.destinationLabel.text = "Destination Folder: " + destination.name;
		sourceFiles = source.getFiles(/\.(bmp|gif|jpg|jpeg|png|psd|tif|tiff)$/i);
		if(sourceFiles == null){
			Window.alert("The folder selected was either invalid or empty.");
		}
	}
} catch(e) {
	writeToError("dlg.source.b.onClick", e);
}

/*
	EVENT NAME: dlg.destination.b.onClick
	DESCRIPTION: 
		The function is called when the user press the destination button. The
		function prompts the user to specify the destination folder and update
		the destination label with the corresponding destination folder path.
*/
try{
	dlg.destination.b.onClick = function(){
		destination = Folder.selectDialog("Select your destination folder in which you like to resize.");
		if(!destination) { destination = null; return; }
		dlg.destinationLabel.text = "Destination Folder: " + destination.name;
	}
} catch(e) {
	writeToError("dlg.destination.b.onClick", e);
}

/*
	EVENT NAME: dlg.buttonGroup.ok.onClick
	DESCRIPTION:
		The function is called when the user press the confirm button. The function
		first converts the text inputs into an integer. The function has a variety
		of checks to ensure that all the variables (including the integer converstions)
		are all correct before resizing the images. If this is successful, each image
		will be resized down to its maximum height or maximum width depending on which
		side is bigger. The function then saves the image as a JPEG with the quality
		specified by the user to the destination folder.
*/
try{
	dlg.buttonGroup.ok.onClick = function(){
		
		maxHeight = parseInt(dlg.maxHeight.t.text);
		maxWidth = parseInt(dlg.maxWidth.t.text);
		dpi = parseInt(dlg.resolution.t.text);
		quality = 12-parseInt(dlg.jpegQuality.p.selection);

		if(source == null) {
			Window.alert( "The destination folder was never specified.\n" + 
			"Step 1: Choose your source folder");
		} else if(sourceFiles.length == 0) {
			Window.alert( "The source folder contains no images that can be resized.\n" + 
			"Please make sure the images are appropriate extensions.");
			return;
		} else if(destination == null) {
			Window.alert( "The destination folder was never specified.\n" +
			"Go to Step 2: Choose your destination folder");
			return;
		} else if(maxHeight.toString() == "NaN"){
			Window.alert( "Invalid maximum height input.\n" +
			"Go to Step 3: What is your maximum height (in pixels)?");
			return;
		} else if(maxWidth.toString() == "NaN"){
			Window.alert( "Invalid maximum width input.\n" +
			"Go to Step 4: What is your maximum width (in pixels)?");
			return;
		} else if(dpi.toString() == "NaN"){
			Window.alert( "Invalid specified resolution input.\n" +
			"Go to Step 5: What is your specified resolution (in dpi)?");
			return;
		} else if(quality.toString() == "NaN"){
			Window.alert( "Invalid specified JPEG image quality input.\n" +
			"Go to Step 6: What is your JPEG image quality?");
			return;
		}

		for(var i=0; i < sourceFiles.length; i++){
			if(open(sourceFiles[i]) != null) {
				var cur_height = app.activeDocument.height.as("px");
				var cur_width = app.activeDocument.width.as("px");

				if(app.activeDocument.bitsPerChannel != BitsPerChannelType.EIGHT){
					app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
				}

				if(cur_height-maxHeight <= 0 && cur_width-maxWidth <= 0){
				} else if(cur_height-maxHeight > cur_width-maxWidth){
					var percent = 1.0-((cur_height-maxHeight)/cur_height);
					app.activeDocument.resizeImage(new UnitValue(cur_width*percent,"px"), new UnitValue(maxHeight, "px"), dpi);
				} else{
					var percent = 1.0-((cur_width-maxWidth)/cur_width);
					app.activeDocument.resizeImage(new UnitValue(maxWidth,"px"), new UnitValue(cur_height*percent, "px"), dpi);
				}
				// Assuming the whole word before the "." is the file name and after is the extension
				var filename = app.activeDocument.name.split(".");
				var jpgFile = new File(destination + "/" + filename[0] + ".jpg");
				var jpgSaveOptions = new JPEGSaveOptions();
				jpgSaveOptions.quality = quality;

				app.activeDocument.saveAs(jpgFile, jpgSaveOptions);
				app.activeDocument.close(SaveOptions.SAVECHANGES);
			} else {
				Window.alert("Unable to open " + sourceFiles[i].displayName);
			}
		}
	}
} catch(e) {
	writeToError("dlg.buttonGroup.ok.onClick", e);
}

/*
	The following commands are to center and display the dialog.
*/
try{
	// Display the dialog window
	dlg.center();
	dlg.show();
} catch(e) {
	writeToError("Dialog Display", e);
}

/*
	FUNCTION: writeToError
	PARAMETER(S):
		funName - function name
		e - an error object
	DESCRIPTION:
		This function is used to display an alert to the user when there's an
		error in the script. The function displays the function name, the
		line number the error occured, and the error.
*/
function writeToError(funName, e) {
	Window.alert("An error occured while running the script.\n" + 
		"The error was found in the function: " + funName + "\n" +
		"The error was found at the line number: " + e.line + "\n" +
		"The error message was: " + e);
}
