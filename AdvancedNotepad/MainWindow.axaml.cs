using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Media;
using Avalonia.Platform.Storage;
using Avalonia.Threading;
using Avalonia.Input;
using System;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AdvancedNotepad;

public partial class MainWindow : Window
{
    private System.Timers.Timer? _autoSaveTimer;
    private const string ConfigFileName = "notepad-config.json";
    private const string ContentFileName = "notepad-content.txt";
    private const string ImagePlaceholder = "[IMAGE]";

    public MainWindow()
    {
        InitializeComponent();
        InitializeControls();
        LoadSettings();
        StartAutoSave();
        
        Editor.TextChanged += OnEditorTextChanged;
        Editor.AddHandler(KeyDownEvent, OnEditorKeyDown, RoutingStrategies.Tunnel);
        FontSizeTextBox.TextChanged += OnFontSizeTextChanged;
        FontSizeTextBox.LostFocus += OnFontSizeLostFocus;
    }

    private void InitializeControls()
    {
        OpacitySlider.ValueChanged += OnOpacityChanged;
        TopMostCheckBox.IsCheckedChanged += OnTopMostChanged;
        ThemeComboBox.SelectionChanged += OnThemeChanged;

        _autoSaveTimer = new System.Timers.Timer(30000);
        _autoSaveTimer.Elapsed += OnAutoSave;
        _autoSaveTimer.AutoReset = true;
    }

    private void LoadSettings()
    {
        try
        {
            var configDir = GetConfigDirectory();
            var configPath = Path.Combine(configDir, ConfigFileName);
            var contentPath = Path.Combine(configDir, ContentFileName);

            if (File.Exists(configPath))
            {
                var config = File.ReadAllText(configPath);
                var parts = config.Split('|');

                if (parts.Length >= 5)
                {
                    if (double.TryParse(parts[0], out double fontSize))
                        FontSizeTextBox.Text = fontSize.ToString();
                    
                    if (double.TryParse(parts[1], out double opacity))
                    {
                        OpacitySlider.Value = opacity;
                        OpacityText.Text = $"{opacity}%";
                    }
                    
                    if (bool.TryParse(parts[2], out bool topMost))
                        TopMostCheckBox.IsChecked = topMost;
                    
                    var theme = parts[3];
                    ApplyTheme(theme);

                    if (double.TryParse(parts[4], out double windowWidth))
                        Width = windowWidth;
                    
                    if (double.TryParse(parts[5], out double windowHeight))
                        Height = windowHeight;
                }
            }

            if (File.Exists(contentPath))
            {
                Editor.Text = File.ReadAllText(contentPath);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"加载设置失败: {ex.Message}");
        }
    }

    private void SaveSettings()
    {
        try
        {
            var configDir = GetConfigDirectory();
            Directory.CreateDirectory(configDir);
            
            var configPath = Path.Combine(configDir, ConfigFileName);
            var fontSize = double.TryParse(FontSizeTextBox.Text, out var fs) ? fs : 12.0;
            var opacity = OpacitySlider.Value;
            var topMost = TopMostCheckBox.IsChecked ?? false;
            var theme = "Light";
            if (ThemeComboBox.SelectedItem is ComboBoxItem item)
            {
                theme = item.Tag?.ToString() ?? "Light";
            }
            var config = $"{fontSize}|{opacity}|{topMost}|{theme}|{Width}|{Height}";
            File.WriteAllText(configPath, config);

            var contentPath = Path.Combine(configDir, ContentFileName);
            File.WriteAllText(contentPath, Editor.Text ?? "");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"保存设置失败: {ex.Message}");
        }
    }

    private string GetConfigDirectory()
    {
        var appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        return Path.Combine(appData, "AdvancedNotepad");
    }

    private void StartAutoSave()
    {
        _autoSaveTimer?.Start();
    }

    private void OnAutoSave(object? sender, System.Timers.ElapsedEventArgs e)
    {
        Dispatcher.UIThread.Post(() => SaveSettings());
    }

    private void OnFontSizeTextChanged(object? sender, TextChangedEventArgs e)
    {
        if (double.TryParse(FontSizeTextBox.Text, out double fontSize) && fontSize >= 8 && fontSize <= 72)
        {
            Editor.FontSize = fontSize;
        }
    }

    private void OnFontSizeLostFocus(object? sender, RoutedEventArgs e)
    {
        if (double.TryParse(FontSizeTextBox.Text, out double fontSize))
        {
            if (fontSize < 8) fontSize = 8;
            if (fontSize > 72) fontSize = 72;
            FontSizeTextBox.Text = fontSize.ToString();
            Editor.FontSize = fontSize;
        }
        else
        {
            FontSizeTextBox.Text = "12";
            Editor.FontSize = 12;
        }
    }

    private void OnOpacityChanged(object? sender, RoutedEventArgs e)
    {
        if (sender is Slider slider)
        {
            Opacity = slider.Value / 100.0;
            OpacityText.Text = $"{slider.Value}%";
        }
    }

    private void OnTopMostChanged(object? sender, RoutedEventArgs e)
    {
        CanResize = !(TopMostCheckBox.IsChecked ?? false);
    }

    private void OnThemeChanged(object? sender, SelectionChangedEventArgs e)
    {
        if (ThemeComboBox.SelectedItem is ComboBoxItem item)
        {
            ApplyTheme(item.Tag?.ToString());
        }
    }

    private void ApplyTheme(string? theme)
    {
        if (theme == "Dark")
        {
            Editor.Background = new SolidColorBrush(Color.FromRgb(30, 30, 30));
            Editor.Foreground = new SolidColorBrush(Color.FromRgb(220, 220, 220));
            this.Background = new SolidColorBrush(Color.FromRgb(30, 30, 30));
        }
        else
        {
            Editor.Background = Brushes.White;
            Editor.Foreground = Brushes.Black;
            this.Background = Brushes.White;
        }
    }

    private void OnEditorKeyDown(object? sender, KeyEventArgs e)
    {
        if ((e.Key == Avalonia.Input.Key.V && e.KeyModifiers == Avalonia.Input.KeyModifiers.Control) ||
            (e.Key == Avalonia.Input.Key.Insert && e.KeyModifiers == Avalonia.Input.KeyModifiers.Shift))
        {
            TryPasteImage();
        }
    }

    private async void TryPasteImage()
    {
        try
        {
            if (TopLevel.GetTopLevel(Editor) is not Window window)
                return;

            var clipboard = window.Clipboard;
            var data = await clipboard.GetDataAsync("Bitmap");
            
            if (data != null)
            {
                var imageText = $"\n{ImagePlaceholder} (图片已粘贴)\n";
                var caretIndex = Editor.CaretIndex;
                var currentText = Editor.Text ?? "";
                Editor.Text = currentText.Insert(caretIndex, imageText);
                Editor.CaretIndex = caretIndex + imageText.Length;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"粘贴图片失败: {ex.Message}");
        }
    }

    private void OnEditorTextChanged(object? sender, EventArgs e)
    {
        var text = Editor.Text;
        if (string.IsNullOrEmpty(text))
            return;

        var caretIndex = Editor.CaretIndex;
        if (caretIndex <= 0)
            return;

        if (caretIndex <= text.Length && text[caretIndex - 1] == '=')
        {
            CalculateExpression();
        }
    }

    private void CalculateExpression()
    {
        var text = Editor.Text;
        if (string.IsNullOrEmpty(text))
            return;

        var caretIndex = Editor.CaretIndex;
        if (caretIndex <= 0)
            return;

        var currentLineStart = text.LastIndexOf('\n', caretIndex - 2) + 1;
        var currentLineEnd = text.IndexOf('\n', caretIndex);
        if (currentLineEnd == -1)
            currentLineEnd = text.Length;

        var currentLine = text.Substring(currentLineStart, currentLineEnd - currentLineStart).Trim();
        
        if (!currentLine.EndsWith("="))
            return;

        var expression = currentLine.Substring(0, currentLine.Length - 1).Trim();
        if (string.IsNullOrWhiteSpace(expression))
            return;

        try
        {
            var result = EvaluateExpression(expression);
            var resultText = currentLine + result;

            Editor.Text = text.Substring(0, currentLineStart) + resultText + 
                          text.Substring(currentLineEnd);
            Editor.CaretIndex = currentLineStart + resultText.Length;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"计算失败: {ex.Message}");
        }
    }

    private double EvaluateExpression(string expression)
    {
        expression = expression.ToLower().Trim();

        expression = Regex.Replace(expression, @"\bsin\(([^)]+)\)", m => Math.Sin(DegToRad(double.Parse(m.Groups[1].Value))).ToString());
        expression = Regex.Replace(expression, @"\bcos\(([^)]+)\)", m => Math.Cos(DegToRad(double.Parse(m.Groups[1].Value))).ToString());
        expression = Regex.Replace(expression, @"\btan\(([^)]+)\)", m => Math.Tan(DegToRad(double.Parse(m.Groups[1].Value))).ToString());
        expression = Regex.Replace(expression, @"\blog\(([^)]+)\)", m => Math.Log10(double.Parse(m.Groups[1].Value)).ToString());
        expression = Regex.Replace(expression, @"\bln\(([^)]+)\)", m => Math.Log(double.Parse(m.Groups[1].Value)).ToString());
        expression = Regex.Replace(expression, @"\bsqrt\(([^)]+)\)", m => Math.Sqrt(double.Parse(m.Groups[1].Value)).ToString());
        expression = Regex.Replace(expression, @"\be\^([^+-]+)", m => Math.Exp(double.Parse(m.Groups[1].Value)).ToString());
        expression = Regex.Replace(expression, @"\bexp\(([^)]+)\)", m => Math.Exp(double.Parse(m.Groups[1].Value)).ToString());

        var result = new DataTable().Compute(expression, null);
        return Math.Round(Convert.ToDouble(result), 6);
    }

    private double DegToRad(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }

    protected override void OnClosing(WindowClosingEventArgs e)
    {
        SaveSettings();
        _autoSaveTimer?.Stop();
        _autoSaveTimer?.Dispose();
        base.OnClosing(e);
    }
}
