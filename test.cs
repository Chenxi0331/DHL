using System;
using System.Reflection;
using System.Linq;

public class Program {
    public static void Main() {
        var assembly = Assembly.LoadFrom(@"C:\Users\chenx\.nuget\packages\uipath.web.activities\1.16.2-preview\lib\net5.0-windows7.0\UiPath.Web.Activities.dll"); // Adjust path if needed
        var typeFile = assembly.GetType("UiPath.Web.Activities.Http.Models.FileFormDataPart");
        var ctors = typeFile.GetConstructors();
        foreach (var c in ctors) {
            Console.WriteLine("FileFormDataPart: " + string.Join(", ", c.GetParameters().Select(p => p.ParameterType.Name + " " + p.Name)));
        }
        var typeText = assembly.GetType("UiPath.Web.Activities.Http.Models.TextFormDataPart");
        var ctorsText = typeText.GetConstructors();
        foreach (var c in ctorsText) {
            Console.WriteLine("TextFormDataPart: " + string.Join(", ", c.GetParameters().Select(p => p.ParameterType.Name + " " + p.Name)));
        }
    }
}
