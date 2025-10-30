using System.ComponentModel;

namespace ToDoApi.Enums;

public enum TodoState
{
    [Description("Nový")]
    New,
    [Description("V řešení")]
    InProgress,
    [Description("Dokončeno")]
    Completed,
    [Description("Zrušeno")]
    Cancelled,
}
