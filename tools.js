new Vue({

  el: '#app',
  data: {
    message: 'custom tools',
	currentView : 'GenerateNetClass',
	views : {
		generateNetClass : "GenerateNetClass",
		generateMssqlIndex : "GenerateMssqlIndex",
	},
	netClassModel : {
		sourceText : "",
		sourceType : "",
		netClassText : "",
		fieldNameIndex : "0",
		fieldTypeIndex : "1",
	},
	mssqlIndexModel : {
		tableName : "CallTask",
		indexList : "CustomerId,ProductId,Name;CallTypeId;CustomerId;Status;Principal;Deadline;Caller;CallTime;AnswerStatus;FollowUp;UpdatedOn;",
		createText : "",
	}
  },
	methods:{
		viewTabClick : function(e){
			this.currentView = e.target.text;
		},
		generateMssqlIndexBtnClick : function() {
			var tbNamePara = this.mssqlIndexModel.tableName;
			var indexFieldsPara = this.mssqlIndexModel.indexList.split(';');
			this.mssqlIndexModel.createText = this.getIndexString(tbNamePara,indexFieldsPara);
		},
		getIndexString : function (tbName,indexFields){
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
			return indexString;
		},
		generateNetClassBtnClick : function(){
			var lines = this.netClassModel.sourceText.split('\n');
			var fieldNames = [],fieldTypes = [];
			for(var i =0;i<lines.length;i++){
				var line = lines[i];
				var words = line.split('\t');
				for(var j =0;j<words.length;j++){
					if(j==this.netClassModel.fieldNameIndex)
						fieldNames.push(words[j]);
					if(j==this.netClassModel.fieldTypeIndex)
						fieldTypes.push(words[j]);
				}
				if(fieldNames.length>fieldTypes.length)
					fieldTypes.push('');
				else if(fieldTypes.length>fieldNames.length)
					fieldNames.push('');
			}
			var netClassFieldTemplate = "public [type] [fieldname] { get; set;} \r\n";
			var netClassTextTemp = "";
			for(var k =0;k<fieldNames.length;k++){
				var netType = 'string';
				//debugger;
				switch(fieldTypes[k].toLowerCase()){
					case 'uniqueidentifier':
					netType = 'Guid?';
					break;
					case 'datetime':
					netType = 'DateTime?';
					break;
					default:
					netType = 'string';
					break;
				}
				netClassTextTemp += netClassFieldTemplate.replace('[type]',netType).replace('[fieldname]',fieldNames[k]);
			}
			this.netClassModel.netClassText = netClassTextTemp;
		}
	}
});