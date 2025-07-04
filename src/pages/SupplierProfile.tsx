import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, LogOut, Edit, HelpCircle, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
const industryOptions = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "other", label: "Other" }
];
const certificationOptions = [
  "ISO 9001", "ISO 14001", "ISO 45001", "SOC 2", "GDPR Compliant", "Other"
];
const companySizeOptions = [
  { value: "small", label: "Small (1-50 employees)" },
  { value: "medium", label: "Medium (51-200 employees)" },
  { value: "large", label: "Large (200+ employees)" }
];

function getCroppedImg(imageSrc, croppedAreaPixels, zoom, aspect = 1) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      resolve(canvas.toDataURL('image/jpeg'));
    };
    image.onerror = reject;
  });
}

const SupplierProfile = () => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgOffsetStart, setImgOffsetStart] = useState({ x: 0, y: 0 });

  // Validation functions
  const validateField = (key: string, value: any) => {
    const errors: Record<string, string> = {};
    
    switch (key) {
      case 'companyName':
        if (!value || value.trim().length < 2) {
          errors[key] = 'Company name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          errors[key] = 'Please enter a valid email address';
        }
        break;
      case 'contactPerson':
        if (!value || value.trim().length < 2) {
          errors[key] = 'Contact person must be at least 2 characters';
        }
        break;
      case 'phone':
        if (value && value.trim()) {
          const cleaned = value.replace(/[^\d]/g, "");
          if (!/^\+?[\d\s\-()]{7,}$/.test(value) || cleaned.length < 7) {
            errors[key] = 'Please enter a valid phone number';
          }
        }
        break;
      case 'address':
        if (!value || value.trim().length < 5) {
          errors[key] = 'Please enter a complete address (at least 5 characters)';
        }
        break;
      case 'country':
        if (!value) {
          errors[key] = 'Please select a country';
        }
        break;
      case 'industry':
        if (!value) {
          errors[key] = 'Please select an industry';
        }
        break;
      case 'otherIndustry':
        if (editData?.industry === 'other' && (!value || value.trim().length < 2)) {
          errors[key] = 'Please specify your industry';
        }
        break;
      case 'companySize':
        if (!value) {
          errors[key] = 'Please select company size';
        }
        break;
      case 'yearsInBusiness':
        if (value && !/^\d+$/.test(value)) {
          errors[key] = 'Only numerical values are allowed';
        }
        break;
      case 'turnoverTime':
        if (value && !/^\d+$/.test(value)) {
          errors[key] = 'Only numerical values are allowed';
        }
        break;
    }
    
    return errors;
  };

  const validateAllFields = (data: any) => {
    let allErrors: Record<string, string> = {};
    
    // Validate all relevant fields
    const fieldsToValidate = [
      'companyName', 'email', 'contactPerson', 'phone', 'address', 
      'country', 'industry', 'otherIndustry', 'companySize', 
      'yearsInBusiness', 'turnoverTime'
    ];
    
    fieldsToValidate.forEach(field => {
      const fieldErrors = validateField(field, data[field]);
      allErrors = { ...allErrors, ...fieldErrors };
    });
    
    return allErrors;
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("supplier-username");
    const storedEmail = localStorage.getItem("supplier-email");
    const storedCompanyName = localStorage.getItem("supplier-companyName");
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    let found = null;
    if (storedUsername) {
      found = suppliers.find((s: any) => s.username === storedUsername);
    }
    if (!found && storedEmail) {
      found = suppliers.find((s: any) => s.email === storedEmail);
    }
    if (!found && storedCompanyName) {
      found = suppliers.find((s: any) => s.companyName === storedCompanyName);
    }
    setSupplier(found);
  }, []);

  if (!localStorage.getItem('loggedin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/supplier-login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (supplier === null) {
    return <div>Loading...</div>;
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Supplier Profile Found</CardTitle>
            <CardDescription>
              We couldn't find your supplier profile. Please register or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/start-registration")}>Register</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper to download profile as CSV
  const handleDownloadCSV = () => {
    const replacer = (key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(supplier);
    const csv = [
      header.join(','),
      header.map(fieldName => JSON.stringify(supplier[fieldName], replacer)).join(',')
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplier_profile.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('loggedin');
    navigate('/supplier-login');
  };

  // Format registration date
  const regDate = supplier.submittedAt ? new Date(supplier.submittedAt).toLocaleString() : 'N/A';

  // Status badges
  const riskBadge = supplier.riskCategory ? (
    <Badge className="ml-2" variant={
      supplier.riskCategory === 'Low' ? 'default' :
      supplier.riskCategory === 'Medium' ? 'secondary' :
      'destructive'
    }>
      {supplier.riskCategory} Risk
    </Badge>
  ) : null;
  const regTypeBadge = supplier.registrationType ? (
    <Badge className="ml-2" variant={supplier.registrationType === 'self' ? 'default' : 'secondary'}>
      {supplier.registrationType === 'self' ? 'Self-Registered' : 'Invited'}
    </Badge>
  ) : null;

  // When entering edit mode, copy supplier data
  const handleEdit = () => {
    setEditData({ ...supplier });
    setValidationErrors({});
    setEditMode(true);
  };

  // Handle input changes in edit mode with validation
  const handleEditChange = (key: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [key]: value }));
    
    // Validate the field and update errors
    const fieldErrors = validateField(key, value);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (fieldErrors[key]) {
        newErrors[key] = fieldErrors[key];
      } else {
        delete newErrors[key];
      }
      return newErrors;
    });
  };

  // Save changes to localStorage and state with validation
  const handleSave = () => {
    const allErrors = validateAllFields(editData);
    setValidationErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      return; // Don't save if there are validation errors
    }
    
    const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
    const idx = suppliers.findIndex((s: any) => s.id === supplier.id);
    if (idx !== -1) {
      suppliers[idx] = { ...suppliers[idx], ...editData };
      localStorage.setItem("suppliers", JSON.stringify(suppliers));
      setSupplier(suppliers[idx]);
    }
    setEditMode(false);
    setValidationErrors({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImg(ev.target?.result as string);
        setShowPreview(true);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewSave = () => {
    if (!previewImg) return;
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = () => {
      const scaledW = img.width * zoom;
      const scaledH = img.height * zoom;
      const x = (size - scaledW) / 2 + offset.x;
      const y = (size - scaledH) / 2 + offset.y;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, x, y, scaledW, scaledH);
      const base64 = canvas.toDataURL('image/jpeg');
      if (editMode) {
        setEditData((prev: any) => ({ ...prev, profilePicture: base64 }));
      } else {
        const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
        const idx = suppliers.findIndex((s: any) => s.id === supplier.id);
        if (idx !== -1) {
          suppliers[idx] = { ...suppliers[idx], profilePicture: base64 };
          localStorage.setItem("suppliers", JSON.stringify(suppliers));
          setSupplier(suppliers[idx]);
        }
      }
      setShowPreview(false);
      setPreviewImg(null);
    };
    img.src = previewImg;
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
    setPreviewImg(null);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  const handlePreviewMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setImgOffsetStart({ ...offset });
  };
  const handlePreviewMouseUp = () => setDragging(false);
  const handlePreviewMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setOffset({ x: imgOffsetStart.x + dx, y: imgOffsetStart.y + dy });
  };

  const isFormValid = Object.keys(validationErrors).length === 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {((editMode ? editData?.profilePicture : supplier?.profilePicture)) ? (
              <img
                src={editMode ? editData.profilePicture : supplier.profilePicture}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-400 mr-3"
              />
            ) : (
              <UserCircle className="h-8 w-8 text-blue-600 mr-3" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Supplier Profile</h1>
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              {((editMode ? editData?.profilePicture : supplier?.profilePicture)) ? 'Change Profile Picture' : 'Upload Profile Picture'}
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            {riskBadge}
            {regTypeBadge}
          </div>
          <div className="mt-2 text-sm text-gray-500">Registered: {regDate}</div>
        </div>
        <Card>
        <CardHeader>
            <CardTitle className="dark:text-white">Profile Details</CardTitle>
            <CardDescription className="dark:text-gray-200">
              Welcome, {supplier.companyName || supplier.username}!
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Button variant="outline" className="flex-1" onClick={handleDownloadCSV}>
                <Download className="w-4 h-4 mr-2" /> Download as CSV
              </Button>
              {!editMode && (
                <Button variant="outline" className="flex-1" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}
              {editMode && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleSave}
                    disabled={!isFormValid}
                  >
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="outline" className="flex-1" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => alert('Contact support at support@example.com')}> 
                <HelpCircle className="w-4 h-4 mr-2" /> Contact Support
              </Button>
            </div>
            {editMode && Object.keys(validationErrors).length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(editMode ? editData : supplier).map(([key, value]) => {
                  // Non-editable fields
                  const readOnlyFields = ["id", "submittedAt", "registrationType", "riskScore", "riskCategory"];
                  if (editMode && !readOnlyFields.includes(key)) {
                    // Special field types
                    if (key === "country") {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">Country</TableCell>
                          <TableCell>
                            <Select value={editData.country} onValueChange={val => handleEditChange("country", val)}>
                              <SelectTrigger className={validationErrors.country ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {validationErrors.country && (
                              <p className="text-sm text-red-600 mt-1">{validationErrors.country}</p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (key === "industry") {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">Industry</TableCell>
                          <TableCell>
                            <Select value={editData.industry} onValueChange={val => handleEditChange("industry", val)}>
                              <SelectTrigger className={validationErrors.industry ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {industryOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {validationErrors.industry && (
                              <p className="text-sm text-red-600 mt-1">{validationErrors.industry}</p>
                            )}
                            {editData.industry === "other" && (
                              <div className="mt-2">
                                <Input
                                  value={editData.otherIndustry || ''}
                                  onChange={e => handleEditChange("otherIndustry", e.target.value)}
                                  placeholder="Please specify your industry"
                                  className={validationErrors.otherIndustry ? "border-red-500" : ""}
                                />
                                {validationErrors.otherIndustry && (
                                  <p className="text-sm text-red-600 mt-1">{validationErrors.otherIndustry}</p>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (key === "certifications") {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">Certifications</TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              {certificationOptions.map(cert => (
                                <div key={cert} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={cert}
                                    checked={Array.isArray(editData.certifications) && editData.certifications.includes(cert)}
                                    onCheckedChange={checked => {
                                      const isChecked = checked === true;
                                      const currentCerts = Array.isArray(editData.certifications) ? editData.certifications : [];
                                      if (isChecked) {
                                        handleEditChange("certifications", [...currentCerts, cert]);
                                      } else {
                                        handleEditChange("certifications", currentCerts.filter((c: string) => c !== cert));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={cert}>{cert}</Label>
                                </div>
                              ))}
                              {Array.isArray(editData.certifications) && editData.certifications.includes("Other") && (
                                <div className="mt-2">
                                  <Input
                                    value={editData.otherCertification || ''}
                                    onChange={e => handleEditChange("otherCertification", e.target.value)}
                                    placeholder="Please specify other certification(s)"
                                  />
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (key === "companySize") {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">Company Size</TableCell>
                          <TableCell>
                            <Select value={editData.companySize} onValueChange={val => handleEditChange("companySize", val)}>
                              <SelectTrigger className={validationErrors.companySize ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                              <SelectContent>
                                {companySizeOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {validationErrors.companySize && (
                              <p className="text-sm text-red-600 mt-1">{validationErrors.companySize}</p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    }
                    if (key === "description") {
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium">Description</TableCell>
                          <TableCell>
                            <Textarea
                              value={editData.description || ''}
                              onChange={e => handleEditChange("description", e.target.value)}
                              placeholder="Brief description of your company and services..."
                              rows={3}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    }
                    // Default: text input with validation
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key}</TableCell>
                        <TableCell>
                          <Input
                            value={String(value ?? '')}
                            onChange={e => handleEditChange(key, e.target.value)}
                            className={validationErrors[key] ? "border-red-500" : ""}
                          />
                          {validationErrors[key] && (
                            <p className="text-sm text-red-600 mt-1">{validationErrors[key]}</p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  // View mode or read-only fields
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{Array.isArray(value) ? value.join(', ') : String(value)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {showPreview && previewImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-6 w-[90vw] max-w-md flex flex-col items-center">
              <div className="mb-2 text-center text-gray-700 text-sm">
                Drag to align, use the slider to zoom. The image will be saved as a circle.
              </div>
              <div className="flex gap-6 items-center">
                {/* Main circular preview with grid overlay */}
                <div
                  className="relative w-64 h-64 bg-gray-200 overflow-hidden"
                  style={{ borderRadius: '50%', userSelect: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
                  onMouseDown={handlePreviewMouseDown}
                  onMouseUp={handlePreviewMouseUp}
                  onMouseMove={handlePreviewMouseMove}
                  onMouseLeave={handlePreviewMouseUp}
                >
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: `calc(50% + ${offset.x}px) calc(50% + ${offset.y}px)`,
                      transform: `scale(${zoom})`,
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Grid overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{borderRadius: '50%'}}>
                    <circle cx="50%" cy="50%" r="50%" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                    <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
                  </svg>
                </div>
                {/* Live mini-preview */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-blue-400">
                    <img
                      src={previewImg}
                      alt="Mini Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `calc(50% + ${offset.x}px) calc(50% + ${offset.y}px)`,
                        transform: `scale(${zoom})`,
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">Avatar Preview</span>
                </div>
              </div>
              <div className="w-full flex flex-col items-center mt-4">
                <label className="mb-1">Zoom</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.01"
                  value={zoom}
                  onChange={handleZoomChange}
                  className="w-48"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <Button variant="outline" onClick={handlePreviewCancel}>Cancel</Button>
                <Button onClick={handlePreviewSave}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierProfile;
