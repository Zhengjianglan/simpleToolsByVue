function GetIndexString(tbName,indexFields){
	var ixName = "IX_" + tbName;	//indexTemplate
	var indexString = "";
	for(var i = 0;i < indexFields.length;i++){
		var ixNameSort = ixName + (i + 1) ;
		var colString = "";
		var cols = indexFields[i].split(',');
		for(var j = 0;j<cols.length;j++){
			colString += "["+cols[j]+"]";
			if(j!=cols.length-1)
				colString+=",";
		}
		indexString += "if not exists(SELECT 1 FROM sys.indexes WHERE name = '" + ixNameSort + "' AND object_id = OBJECT_ID('" + tbName + "'))\r\n"+
		"CREATE INDEX " + ixNameSort + " ON [" + tbName + "] (" + colString + ")\r\n"+
		"GO\r\n";
	}

	console.trace(indexString)
}



//input tableName
var tbNamePara = "CallTask";
//input indexFields
//["Field1,Field2","Field3"]
var indexFieldsPara = ['Name','CallTypeId','CustomerId','Status','Principal','Deadline','Caller','CallTime','AnswerStatus','FollowUp','UpdatedOn','CreatedOn'];
GetIndexString(tbNamePara,indexFieldsPara);