new Vue({

  el: '#app',
  data: {
    message: 'custom tools',
	currentView : 'GenerateNetClass',
	views : {
		generateNetClass : "GenerateNetClass",
		generateMssqlIndex : "GenerateMssqlIndex",
		generateInsertSql:"GenerateInsertSql",
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
	},
	generateInsertSqlModel : {
		tableName : "CallTask",
		dataText : "",
		insertText : "",
		exceptExists : '1',
		deleteExists : '0'
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
		generateInsertSqlBtnClick : function() {
			var tbNamePara = this.generateInsertSqlModel.tableName;
			var colRows = this.generateInsertSqlModel.dataText.split('\n');
			var headRow = colRows[0];
			var cols = colRows[0].split('\t');
			var headTemplate = "";
			for(var j = 0;j<cols.length;j++){
				headTemplate += "["+cols[j]+"]";
				if(j!=cols.length-1)
					headTemplate+=",";
			}
			var insertTemplate = "insert into " + tbNamePara + " ([headers]) values ([bodys])";
			var resultTest = "";
			for(var i =1;i<colRows.length;i++){
				var line = colRows[i];
				var words = line.split('\t');
				var colBodyTemplate = "";
				for(var k =0;k<words.length;k++){
					var word = words[k];
					if(word=='NULL')
						;
					else 
						word = "'"+word+"'";
					colBodyTemplate=colBodyTemplate+word;
					if(k!=words.length-1)
						colBodyTemplate = colBodyTemplate+",";
				}
				if(this.generateInsertSqlModel.exceptExists=='1'){
					resultTest = resultTest + "if exists (select 1 from [tablename] where id = '[id]')\r".replace('[tablename]',tbNamePara).replace('[id]',words[0]);
					if(this.generateInsertSqlModel.deleteExists=='1'){
						resultTest = resultTest + "delete from [tablename] where id = '[id]'\r".replace('[tablename]',tbNamePara).replace('[id]',words[0]);
					}
					else{
						resultTest = resultTest + "print '[tablename] item [[id]] exists'\relse\r".replace('[tablename]',tbNamePara).replace('[id]',words[0]);
					}
				}
				resultTest = resultTest + insertTemplate.replace('[headers]',headTemplate).replace('[bodys]',colBodyTemplate);
				resultTest = resultTest + "\rGO\r"
			}
			this.generateInsertSqlModel.insertText=resultTest;
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