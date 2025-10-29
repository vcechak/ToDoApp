using System.ComponentModel;

namespace ToDoApi.Enums;

public enum TodoState
{
    [Description("Nový")]
    New,
    [Description("V řešení")]
    InProgress,
    [Description("Po termínu")]
    Overdue,
    [Description("Dokončeno")]
    Completed,
    [Description("Zrušeno")]
    Cancelled,
}
