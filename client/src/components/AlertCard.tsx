import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ExcelData {
  [key: string]: string;
}

const alertTypes = [
  { value: 'towing', label: 'سحب', labelEn: 'Towing' },
  { value: 'external battery disconnected', label: 'فصل البطارية', labelEn: 'Battery Disconnected' },
  { value: 'overspeed', label: 'سرعة زائدة', labelEn: 'Overspeed' },
  { value: 'stop for 10 day', label: 'توقف 10 أيام', labelEn: 'Stop for 10 Days' },
  { value: 'stop in geofence', label: 'توقف في منطقة جغرافية', labelEn: 'Stop in Geofence' },
];

export default function AlertCard() {
  const [excelData, setExcelData] = useState<ExcelData>(() => {
    try {
      return JSON.parse(localStorage.getItem('excelData') || '{}');
    } catch {
      return {};
    }
  });
  const [trackingData, setTrackingData] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertOutput, setAlertOutput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(Object.keys(excelData).length);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/);
      const newExcelData: ExcelData = {};
      let headerSkip = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (!headerSkip) {
          if (line.toLowerCase().includes('vehicle') && line.toLowerCase().includes('client')) {
            headerSkip = true;
            continue;
          } else {
            headerSkip = true;
          }
        }

        const splitter = line.indexOf('\t') !== -1 ? '\t' : line.indexOf(',') !== -1 ? ',' : null;
        const parts = splitter ? line.split(splitter) : line.split(/\s{2,}/);
        
        const vehicle = (parts[0] || '').replace(/[^A-Za-z0-9]/g, '').replace(/\*/g, '').trim().toLowerCase();
        const client = (parts[1] || '').trim();
        
        if (vehicle) {
          newExcelData[vehicle] = client || 'UNKNOWN CLIENT';
          newExcelData[parts[0].toLowerCase().trim()] = client || 'UNKNOWN CLIENT';
        }
      }

      setExcelData(newExcelData);
      localStorage.setItem('excelData', JSON.stringify(newExcelData));
      setFileLoaded(true);
      setVehicleCount(Object.keys(newExcelData).length / 2);
      
      toast({
        title: 'تم تحميل الملف بنجاح',
        description: `تم تحميل ${Math.floor(Object.keys(newExcelData).length / 2)} مركبة`,
      });
    };
    reader.readAsText(file);
  };

  const getPlate = (tracking: string): string => {
    const addressIdx = tracking.indexOf('Address:');
    const vehicleLine = addressIdx !== -1 
      ? tracking.substring(0, addressIdx).replace(/\n/g, '').trim() 
      : tracking.split('\n')[0];
    const plateMatch = vehicleLine.match(/^[^\s-]*/);
    const plate = plateMatch ? plateMatch[0].replace(/\*/g, '') : vehicleLine.split(/\s+/)[0] || '';
    return plate.trim();
  };

  const getCompany = (plate: string, tracking: string): string => {
    const normalizedPlate = plate.trim().toLowerCase();
    const cleanPlate = normalizedPlate.replace(/[^A-Za-z0-9]/g, '');
    
    if (excelData.hasOwnProperty(cleanPlate)) return excelData[cleanPlate];
    if (excelData.hasOwnProperty(normalizedPlate)) return excelData[normalizedPlate];
    
    const firstLine = tracking.split('\n')[0].trim().toLowerCase();
    if (excelData.hasOwnProperty(firstLine)) return excelData[firstLine];
    
    for (const key in excelData) {
      const keyClean = key.replace(/[^A-Za-z0-9]/g, '');
      if (keyClean === cleanPlate) return excelData[key];
    }
    
    return 'UNKNOWN CLIENT';
  };

  const generateAlert = () => {
    if (!trackingData || !alertType) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بيانات التتبع واختيار نوع التنبيه',
        variant: 'destructive',
      });
      return;
    }

    const plate = getPlate(trackingData);
    const company = getCompany(plate, trackingData);
    setCompanyName(company);

    const addressIdx = trackingData.indexOf('Address:');
    const vehicleLine = addressIdx !== -1 
      ? trackingData.substring(0, addressIdx).replace(/\n/g, '').trim() 
      : trackingData.split('\n')[0];
    const modelColor = vehicleLine.replace(plate, '').trim();

    const addressMatch = trackingData.match(/Address:\s*(.+)/);
    const address = addressMatch ? addressMatch[1].trim() : '';

    const latMatch = trackingData.match(/Latitude:\s*([0-9.\-]+)/);
    const lngMatch = trackingData.match(/Longitude:\s*([0-9.\-]+)/);
    const latitude = latMatch ? latMatch[1] : '';
    const longitude = lngMatch ? lngMatch[1] : '';

    let typeText = '';
    if (alertType === 'overspeed') {
      const speedMatch = trackingData.match(/Speed:\s*([0-9.]+)\s*kph?/i);
      const speed = speedMatch ? speedMatch[1] : '';
      typeText = speed ? `was speeding ${speed} kph` : 'was speeding';
    } else {
      switch (alertType) {
        case 'towing': typeText = 'was on recovery'; break;
        case 'external battery disconnected': typeText = 'had the external battery disconnected'; break;
        case 'stop for 10 day': typeText = 'has stopped for 10 days'; break;
        case 'stop in geofence': typeText = 'has stopped in geofence'; break;
        default: typeText = 'had an event';
      }
    }

    const vehicleDesc = `${company} ${plate} ${modelColor}`.replace(/\s+/g, ' ').trim();
    const msg = [
      `Hello, your vehicle has an event,`,
      `${vehicleDesc} ${typeText} (${address})`,
      latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : '',
      'Clicklife GPS System',
    ].filter(Boolean).join('\n\n');

    setAlertOutput(msg);
    
    toast({
      title: 'تم توليد التنبيه',
      description: 'يمكنك الآن نسخ التنبيه',
    });
  };

  const copyAlert = async () => {
    if (!alertOutput) return;
    
    try {
      await navigator.clipboard.writeText(alertOutput);
      setCopied(true);
      toast({
        title: 'تم النسخ',
        description: 'تم نسخ التنبيه للحافظة',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = alertOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto backdrop-blur-xl bg-card/95 border-border/50 shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          Clicklife GPS Alert
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          توليد رسائل تنبيه احترافية للمركبات
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            رفع ملف TXT (المركبات والعملاء)
          </Label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer"
            data-testid="file-upload-area"
          >
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-all duration-200 hover:border-primary hover:bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {fileLoaded ? `تم تحميل ${vehicleCount} مركبة` : 'اضغط لرفع ملف TXT'}
              </p>
              {fileLoaded && (
                <Badge variant="secondary" className="mt-2">
                  تم التحميل
                </Badge>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-file-upload"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            ارفع ملف TXT بتنسيق: Vehicle[Tab]Client
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            بيانات التتبع
          </Label>
          <Textarea
            value={trackingData}
            onChange={(e) => setTrackingData(e.target.value)}
            placeholder="657014 Changan&#10;Address: New Industrial, Ajman, UAE&#10;Speed: 105 kph"
            className="min-h-[120px] bg-muted/30 border-border focus:border-primary transition-colors resize-none font-mono text-sm"
            dir="ltr"
            data-testid="textarea-tracking-data"
          />
          <p className="text-xs text-muted-foreground">
            قم بلصق بيانات تتبع المركبة من النظام هنا
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">
            نوع التنبيه
          </Label>
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger 
              className="bg-muted/30 border-border focus:border-primary"
              data-testid="select-alert-type"
            >
              <SelectValue placeholder="-- اختر نوع التنبيه --" />
            </SelectTrigger>
            <SelectContent>
              {alertTypes.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  data-testid={`select-item-${type.value}`}
                >
                  <span>{type.label}</span>
                  <span className="text-muted-foreground text-xs mr-2">({type.labelEn})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={generateAlert}
            className="flex-1 font-medium"
            data-testid="button-generate-alert"
          >
            توليد التنبيه
          </Button>
          
          {alertOutput && (
            <Button
              onClick={copyAlert}
              variant="outline"
              data-testid="button-copy-alert"
            >
              {copied ? 'تم النسخ' : 'نسخ'}
            </Button>
          )}
        </div>

        {companyName && (
          <div>
            <Badge 
              variant="secondary" 
              className="w-full justify-center py-2 text-base"
              data-testid="badge-company-name"
            >
              العميل: <span className="font-bold mr-1">{companyName}</span>
            </Badge>
          </div>
        )}

        {alertOutput && (
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              النتيجة
            </Label>
            <Textarea
              value={alertOutput}
              readOnly
              className="min-h-[140px] bg-muted/30 border-border font-mono text-sm"
              dir="ltr"
              data-testid="textarea-alert-output"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
