var serviceTemplate = 
"using System;\r\n"+
"using System.Collections.Generic;\r\n"+
"using System.Linq;\r\n"+
"using System.Text;\r\n"+
"using System.Threading.Tasks;\r\n"+
"using BLTS.API.Framework.Common.ModelBase;\r\n"+
"using BLTS.API.Framework.Common.ServiceBase;\r\n"+
"using BLTS.CRM.API.ServiceModel.Entity;\r\n"+
"using ServiceStack;\r\n"+
"using ServiceStack.OrmLite;\r\n"+
"\r\n"+
"namespace BLTS.CRM.API.ServiceInterface\r\n"+
"{\r\n"+
"    public class {EntityName}Service : BaseAutoQueryService\r\n"+
"    {\r\n"+
"        public virtual object Post({EntityName}s request)\r\n"+
"        {\r\n"+
"            var result = new BaseReturnDTO();\r\n"+
"            var entity = request.ConvertTo<{EntityName}>();\r\n"+
"            var ret = Db.Insert(entity);\r\n"+
"            result.IsOK = ret != 0;\r\n"+
"            result.Results = entity;\r\n"+
"\r\n"+
"\r\n"+
"            return result;\r\n"+
"        }\r\n"+
"\r\n"+
"\r\n"+
"        public virtual object Put({EntityName}s request)\r\n"+
"        {\r\n"+
"            var result = new BaseReturnDTO();\r\n"+
"            var entity = request.ConvertTo<{EntityName}>();\r\n"+
"            var ret = Db.UpdateNonDefaults(entity, i => i.Id == entity.Id);\r\n"+
"            result.IsOK = ret != 0;\r\n"+
"            result.Results = ret;\r\n"+
"\r\n"+
"            return result;\r\n"+
"        }\r\n"+
"\r\n"+
"\r\n"+
"        public virtual object Delete({EntityName}s request)\r\n"+
"        {\r\n"+
"            var result = new BaseReturnDTO();\r\n"+
"            var ret = Db.Delete<{EntityName}>(i => i.Id == request.Id);\r\n"+
"            result.IsOK = ret != 0;\r\n"+
"            result.Results = ret;\r\n"+
"\r\n"+
"            return result;\r\n"+
"        }\r\n"+
"\r\n"+
"        public virtual object Get({EntityName}s request)\r\n"+
"        {\r\n"+
"            var q = AutoQuery.CreateQuery(request, base.Request);\r\n"+
"            var queryResponse = AutoQuery.Execute(request, q);\r\n"+
"            return queryResponse;\r\n"+
"        }\r\n"+
"    }\r\n"+
"}\r\n";
