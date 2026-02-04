import React, { useRef, useState, useEffect } from "react";
import {
  CreditCard,
  MapPin,
  Star,
  Check,
  AlertCircle,
  Shield,
  Upload,
  X,
  LogOut,
  UserPlus,
  Trash2,
  Users,
  Camera,
  User,
} from "lucide-react";
import { Form, Col, Row, Card, Image, Modal } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../../assets/css/BasicDetail.css";
import languagesType from "./data.json";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const RELATIONSHIP_CHOICES = [
  { value: "spouse", label: "Spouse" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
];

const MEMBERSHIP_PRICE = 49;

const VaidyaBandhuForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAddMembersMode = searchParams.get("mode") === "add-members";

  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    blood_group: "",
    mobile: "",
    alternate_mobile: "",
    address: "",
    pin_code: "",
    photo: null,
  });

  // Family members state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [existingMembersCount, setExistingMembersCount] = useState(0);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // New state for welcome modal
  const [apiProcessing, setApiProcessing] = useState(false);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Payment state tracking
  const [hasPendingDraft, setHasPendingDraft] = useState(false);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const DRAFT_KEY = 'vaidyabandhu_draft_registration';



  const FullScreenLoader = ({ text = "Please wait..." }) => (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.8)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div className="spinner-border text-primary" role="status" />
      <p style={{ marginTop: 12, fontWeight: 500 }}>{text}</p>
    </div>
  );


  // Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [croppedFile, setCroppedFile] = useState(null);

  // Handle language change
  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({
          ...prev,
          photo: languagesType[selectedLanguage].validation.photoValid,
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: languagesType[selectedLanguage].validation.photoSize,
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://admin.vaidyabandhu.com/api/user/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          if (data.photo || data.profile_image) {
            setPhotoPreview(data.photo || data.profile_image);
          }
          // Check if user is already active (existing member)
          if (data.is_active === true) {
            setIsExistingUser(true);
            // Count existing family members if available
            if (data.family_members && Array.isArray(data.family_members)) {
              setExistingMembersCount(data.family_members.length);
            }
            // Clear any saved draft if user is now active
            localStorage.removeItem(DRAFT_KEY);
          } else {
            // Check for pending draft if user is not active
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (savedDraft) {
              try {
                const draft = JSON.parse(savedDraft);
                // Check if draft is not too old (24 hours)
                const draftAge = Date.now() - draft.timestamp;
                if (draftAge < 24 * 60 * 60 * 1000) {
                  setHasPendingDraft(true);
                  setShowResumeBanner(true);
                } else {
                  // Remove old draft
                  localStorage.removeItem(DRAFT_KEY);
                }
              } catch (e) {
                console.error('Error parsing draft:', e);
                localStorage.removeItem(DRAFT_KEY);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);
  // Handle photo removal
  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photo: null }));
    setCroppedFile(null);
  };

  // Crop functions
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const onCropComplete = (c) => {
    setCompletedCrop(c);
  };

  const createCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Convert percentage values to pixel values
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedBlob = await createCroppedImage();
      if (!croppedBlob) return;

      // Get original file name safely
      const originalFile = document.getElementById('photo-upload')?.files[0];
      const originalName = originalFile?.name || 'profile-photo.jpg';
      const fileExt = originalName.split('.').pop();
      const safeName = `profile_${Date.now()}.${fileExt}`;

      const croppedFile = new File([croppedBlob], safeName, {
        type: croppedBlob.type || 'image/jpeg',
        lastModified: Date.now(),
      });

      setCroppedFile(croppedFile);
      setPhotoPreview(URL.createObjectURL(croppedBlob));
      setFormData((prev) => ({
        ...prev,
        photo: croppedFile,
      }));

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });
    } catch (e) {
      console.error('Error cropping image', e);
    } finally {
      setCropModalOpen(false);
      setImgSrc(null);
      setCompletedCrop(null);
    }
  };

  // Family member handlers
  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      {
        id: Date.now(),
        full_name: "",
        age: "",
        gender: "",
        blood_group: "",
        relationship: "",
        profile_image: null,
        imagePreview: null,
      },
    ]);
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
    // Clear any errors for this member
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`member_${id}_`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const updateFamilyMember = (id, field, value) => {
    if (field === "profile_image") {
      console.log("Updating profile_image in state:", { id, hasValue: !!value, valueType: typeof value });
    }
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
    // Clear error for this field
    if (errors[`member_${id}_${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`member_${id}_${field}`];
        return newErrors;
      });
    }
  };

  const handleMemberPhotoChange = (memberId, e) => {
    const file = e.target.files[0];
    console.log("Photo upload triggered:", { memberId, hasFile: !!file });
    if (file) {
      console.log("File details:", { name: file.name, type: file.type, size: file.size });
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({
          ...prev,
          [`member_${memberId}_photo`]: "Please upload a valid image file",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [`member_${memberId}_photo`]: "Photo size must be less than 2MB",
        }));
        return;
      }
      const preview = URL.createObjectURL(file);
      console.log("Updating member with profile_image:", file);
      updateFamilyMember(memberId, "profile_image", file);
      updateFamilyMember(memberId, "imagePreview", preview);
    }
  };

  const removeMemberPhoto = (memberId) => {
    const member = familyMembers.find((m) => m.id === memberId);
    if (member?.imagePreview && member.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(member.imagePreview);
    }
    updateFamilyMember(memberId, "profile_image", null);
    updateFamilyMember(memberId, "imagePreview", null);
  };

  // Helper to trigger file input click
  const triggerFileInput = (memberId) => {
    const fileInput = document.getElementById(`member-photo-${memberId}`);
    console.log("🎯 Attempting to click file input:", `member-photo-${memberId}`, fileInput);
    if (fileInput) {
      fileInput.click();
    } else {
      console.error("❌ File input not found:", `member-photo-${memberId}`);
    }
  };

  // Calculate subscription count
  const getSubscriptionCount = () => {
    if (isAddMembersMode || isExistingUser) {
      // Only charge for new members being added
      return familyMembers.length;
    }
    // New user: 1 (self) + family members
    return 1 + familyMembers.length;
  };

  const getTotalPrice = () => {
    return getSubscriptionCount() * MEMBERSHIP_PRICE;
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate user form if not in add-members mode
    if (!isAddMembersMode) {
      if (!(formData.full_name || "").trim()) {
        newErrors.full_name =
          languagesType[selectedLanguage].validation.fullNameRequired;
      }

      if (!(formData.age || "").toString().trim()) {
        newErrors.age = languagesType[selectedLanguage].validation.ageRequired;
      } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
        newErrors.age = languagesType[selectedLanguage].validation.ageValid;
      }

      if (!formData.gender) {
        newErrors.gender =
          languagesType[selectedLanguage].validation.genderRequired;
      }

      if (!(formData.mobile || "").trim()) {
        newErrors.mobile_number =
          languagesType[selectedLanguage].validation.mobileRequired;
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        newErrors.mobile_number =
          languagesType[selectedLanguage].validation.mobileValid;
      }

      if (!(formData.address || "").trim()) {
        newErrors.address =
          languagesType[selectedLanguage].validation.addressRequired;
      }

      if (!(formData.pin_code || "").trim()) {
        newErrors.pin_code =
          languagesType[selectedLanguage].validation.pinCodeRequired;
      } else if (!/^\d{6}$/.test(formData.pin_code)) {
        newErrors.pin_code =
          languagesType[selectedLanguage].validation.pinCodeValid;
      }

      if (
        formData.alternate_mobile &&
        !/^[6-9]\d{9}$/.test(formData.alternate_mobile)
      ) {
        newErrors.alternate_mobile =
          languagesType[selectedLanguage].validation.alternateValid;
      }
    }

    // Validate family members
    familyMembers.forEach((member) => {
      if (!(member.full_name || "").trim()) {
        newErrors[`member_${member.id}_full_name`] =
          languagesType[selectedLanguage].familyMembers?.memberFullNameRequired || "Full name is required";
      }
      if (!(member.age || "").toString().trim()) {
        newErrors[`member_${member.id}_age`] =
          languagesType[selectedLanguage].familyMembers?.memberAgeRequired || "Age is required";
      } else if (isNaN(member.age) || member.age < 1 || member.age > 120) {
        newErrors[`member_${member.id}_age`] =
          languagesType[selectedLanguage].familyMembers?.memberAgeValid || "Please enter a valid age (1-120)";
      }
      if (!member.gender) {
        newErrors[`member_${member.id}_gender`] =
          languagesType[selectedLanguage].familyMembers?.memberGenderRequired || "Gender is required";
      }
      if (!member.relationship) {
        newErrors[`member_${member.id}_relationship`] =
          languagesType[selectedLanguage].familyMembers?.memberRelationshipRequired || "Relationship is required";
      }
      if (!member.blood_group) {
        newErrors[`member_${member.id}_blood_group`] =
          languagesType[selectedLanguage].familyMembers?.memberBloodGroupRequired || "Blood group is required";
      }
      if (!member.profile_image) {
        newErrors[`member_${member.id}_photo`] =
          languagesType[selectedLanguage].familyMembers?.memberPhotoRequired || "Member photo is required";
      }
    });

    // In add-members mode, require at least one member
    if (isAddMembersMode && familyMembers.length === 0) {
      newErrors.familyMembers =
        languagesType[selectedLanguage].familyMembers?.atLeastOneMember || "Please add at least one family member";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e, fieldName) => {
    const value = e.target.value;
    const maxLength =
      fieldName === "pin_code"
        ? 6
        : fieldName === "mobile_number"
          ? 10
          : 3;

    if (/^[0-9]*$/.test(value) && value.length <= maxLength) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Save draft to localStorage
  const saveDraftToLocalStorage = () => {
    try {
      const draft = {
        formData: {
          ...formData,
          photo: null, // Don't save file objects
        },
        familyMembers: familyMembers.map(m => ({
          ...m,
          profile_image: null, // Don't save file objects
          imagePreview: null,
        })),
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      console.log('Draft saved to localStorage');
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  };

  // Load draft from localStorage
  const loadDraftFromLocalStorage = () => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData);
        setFamilyMembers(draft.familyMembers);
        setShowResumeBanner(false);
        setHasPendingDraft(false);
        console.log('Draft loaded from localStorage');
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasPendingDraft(false);
    setShowResumeBanner(false);
    console.log('Draft cleared from localStorage');
  };

  // Handle resume registration
  const handleResumeRegistration = () => {
    loadDraftFromLocalStorage();
    // Just restore data, let user edit and click pay manually
  };

  // Handle start fresh
  const handleStartFresh = () => {
    clearDraft();
    // Reset form
    setFormData({
      full_name: "",
      age: "",
      gender: "",
      blood_group: "",
      mobile: "",
      alternate_mobile: "",
      address: "",
      pin_code: "",
      aadhaar_number: "",
      pan_number: "",
      photo: null,
    });
    setFamilyMembers([]);
    setPhotoPreview(null);
    setErrors({});
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear all errors on successful validation
    setErrors({});

    const subscriptionCount = getSubscriptionCount();

    // If no subscription needed (adding 0 members), just save and redirect
    if (subscriptionCount === 0) {
      alert("Please add at least one family member");
      return;
    }

    setIsSubmitting(true);
    setApiProcessing(true);

    try {
      const token = localStorage.getItem("token");

      /* ---------- SAVE DRAFT BEFORE PAYMENT ---------- */
      saveDraftToLocalStorage();

      /* ---------- 1. CREATE ORDER (Payment First) ---------- */
      const orderRes = await fetch(
        "https://admin.vaidyabandhu.com/api/payment/create_order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ subscription: subscriptionCount }),
        }
      );

      if (!orderRes.ok) {
        throw new Error("Order creation failed. Payment not started.");
      }

      const orderData = await orderRes.json();

      /* ---------- 2. LOAD RAZORPAY ---------- */
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Payment SDK failed to load");
      }

      /* ---------- 3. OPEN PAYMENT ---------- */
      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VaidyaBandhu Membership",
        description: `Membership Payment (${subscriptionCount} ${subscriptionCount === 1 ? 'member' : 'members'})`,
        order_id: orderData.order_id,

        handler: async function (rpResponse) {
          try {
            /* ---------- 4. VERIFY PAYMENT ---------- */
            const callbackRes = await fetch(
              "https://admin.vaidyabandhu.com/api/payment/callback/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  razorpay_order_id: rpResponse.razorpay_order_id,
                  razorpay_payment_id: rpResponse.razorpay_payment_id,
                  razorpay_signature: rpResponse.razorpay_signature,
                }),
              }
            );

            if (!callbackRes.ok) {
              throw new Error("Payment verification failed");
            }

            /* ---------- 5. SAVE PROFILE (after payment success) ---------- */
            if (!isAddMembersMode) {
              const formDataToSend = new FormData();
              const profileData = {
                full_name: formData.full_name,
                age: formData.age,
                gender: formData.gender,
                blood_group: formData.blood_group || "",
                address: formData.address,
                pin_code: formData.pin_code,
                mobile: formData.mobile,
                alternate_number: formData.alternate_mobile || "",
              };

              console.log("Profile data being sent:", profileData);
              Object.entries(profileData).forEach(([k, v]) => formDataToSend.append(k, v));

              if (formData.photo) {
                formDataToSend.append("profile_image", formData.photo);
              }

              // Add family members as JSON string
              if (familyMembers.length > 0) {
                const membersData = familyMembers.map((m) => ({
                  full_name: m.full_name,
                  age: parseInt(m.age),
                  gender: m.gender,
                  relationship: m.relationship,
                  blood_group: m.blood_group || "",
                }));
                console.log("Family members data:", membersData);
                formDataToSend.append("family_members", JSON.stringify(membersData));

                // Add member images as separate fields
                familyMembers.forEach((m, index) => {
                  if (m.profile_image) {
                    formDataToSend.append(`member_image${index + 1}`, m.profile_image);
                  }
                });
              }

              const profileRes = await fetch(
                "https://admin.vaidyabandhu.com/api/user/profile/",
                {
                  method: "POST",
                  headers: { Authorization: token },
                  body: formDataToSend,
                }
              );

              if (!profileRes.ok) {
                const errorText = await profileRes.text();
                console.error("Profile update failed:", profileRes.status, errorText);
                throw new Error(`Profile save failed: ${profileRes.status}`);
              }
            } else {
              /* ---------- 6. ADD FAMILY MEMBERS (for existing users) ---------- */
              console.log("📊 TOTAL FAMILY MEMBERS TO ADD:", familyMembers.length);
              console.log("📋 Full familyMembers state:", familyMembers.map(m => ({
                id: m.id,
                name: m.full_name,
                hasImage: !!m.profile_image,
                imageType: m.profile_image?.type || 'none',
                hasPreview: !!m.imagePreview
              })));

              for (const member of familyMembers) {
                const memberFormData = new FormData();
                memberFormData.append("full_name", member.full_name);
                memberFormData.append("age", member.age);
                memberFormData.append("gender", member.gender);
                memberFormData.append("blood_group", member.blood_group || "");
                memberFormData.append("relationship", member.relationship);
                memberFormData.append("adhaar_number", "");
                memberFormData.append("pan_number", "");

                // Debug: Check if profile_image exists
                console.log("👤 Processing member:", {
                  name: member.full_name,
                  hasImage: !!member.profile_image,
                  imageType: member.profile_image ? member.profile_image.type : 'none',
                  imageSize: member.profile_image ? member.profile_image.size : 0
                });

                if (member.profile_image) {
                  memberFormData.append("profile_image", member.profile_image);
                  console.log("✅ profile_image ADDED to FormData");
                } else {
                  console.log("❌ profile_image NOT ADDED - member.profile_image is:", member.profile_image);
                }

                console.log("Adding member:", member.full_name);
                const memberRes = await fetch(
                  "https://admin.vaidyabandhu.com/api/add/member/",
                  {
                    method: "POST",
                    headers: { Authorization: token },
                    body: memberFormData,
                  }
                );

                if (!memberRes.ok) {
                  const errorText = await memberRes.text();
                  console.error("Failed to add member:", member.full_name, memberRes.status, errorText);
                  throw new Error(`Failed to add member: ${member.full_name}`);
                }
              }
            }

            /* ---------- CLEAR DRAFT ON SUCCESS ---------- */
            clearDraft();
            setShowWelcomeModal(true);
          } catch (err) {
            console.error("Error after payment:", err);
            alert("Payment successful but there was an error saving your data. Please contact support.");
            navigate("/myprofile");
          } finally {
            setApiProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setApiProcessing(false);
            // Show notification about saved draft
            setShowResumeBanner(true);
            setHasPendingDraft(true);
          },
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
      setApiProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(
        /=.*/,
        "=;expires=" + new Date(0).toUTCString() + ";path=/"
      );
    });
    setShowLogoutModal(false);
    window.location.href = "/";
  };

  const benefits = languagesType[selectedLanguage].benefits;
  const termsConditions = languagesType[selectedLanguage].terms;

  {
    apiProcessing && (
      <FullScreenLoader text="Finalizing your membership..." />
    )
  }

  return (
    <div className="container-fluid bg-light py-5 container-bg">
      {apiProcessing && (
        <FullScreenLoader text="Finalizing your membership..." />
      )}
      <style>
        {`
          @media (max-width: 768px) {
            .mobile-heading {
              font-size: 1.1rem !important;
              text-align: center !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .mobile-heading svg {
              margin-right: 8px !important;
            }
          }
        `}
      </style>

      <div className="container">
        <div className="d-flex justify-content-end">
          <div className="text-right mb-4" style={{ width: "200px" }}>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="ml">Malayalam</option>
              <option value="kn">Kannada</option>
            </select>
          </div>
        </div>

        {/* Resume Banner for Pending Draft */}
        {showResumeBanner && hasPendingDraft && !isAddMembersMode && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1" }}>
              <AlertCircle
                style={{ color: "#856404", flexShrink: 0 }}
                size={24}
              />
              <div>
                <h5 style={{ margin: 0, color: "#856404", fontSize: "16px", fontWeight: 600 }}>
                  Incomplete Registration Found
                </h5>
                <p style={{ margin: "4px 0 0 0", color: "#856404", fontSize: "14px" }}>
                  You have an incomplete registration. Would you like to continue where you left off?
                </p>
                <p style={{ margin: "2px 0 0 0", color: "#856404", fontSize: "12px", fontStyle: "italic" }}>
                  Note: Uploaded photos must be re-selected.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleResumeRegistration}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                disabled={isSubmitting}
              >
                <CreditCard size={16} />
                Restore Saved Data
              </button>
              <button
                onClick={handleStartFresh}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                disabled={isSubmitting}
              >
                <X size={16} />
                Start Fresh
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-5">
          <h1 className="display-4 mb-2 " style={{ fontFamily: "Poppins" }}>
            {isAddMembersMode
              ? (languagesType[selectedLanguage].familyMembers?.addMembersTitle || "Add Family Members")
              : languagesType[selectedLanguage].title}
          </h1>
          <p
            className="lead secondary-color mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            {isAddMembersMode
              ? (languagesType[selectedLanguage].familyMembers?.addMemberHint || "Add family members to include them in your membership")
              : languagesType[selectedLanguage].subtitle}
          </p>
        </div>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h4 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <Star className="h-6 w-6 text-yellow-500 me-1" />{" "}
                  {languagesType[selectedLanguage].membershipBenefits}
                </h4>
                <ul className="list-unstyled">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-start mb-2"
                      style={{ fontFamily: "Poppins" }}
                    >
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="ms-2">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h2 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <CreditCard className="h-6 w-6 secondary-color me-2" />{" "}
                  {languagesType[selectedLanguage].membershipCharges}
                </h2>
                <div className="text-center">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ fontSize: "27px", color: "#007a7e" }}
                  >
                    ₹{getTotalPrice()}
                  </div>
                  {getSubscriptionCount() > 1 && (
                    <div
                      className="text-sm mb-2"
                      style={{ fontFamily: "Poppins", color: "#666" }}
                    >
                      ₹{MEMBERSHIP_PRICE} × {getSubscriptionCount()} {getSubscriptionCount() === 1 ? 'member' : 'members'}
                    </div>
                  )}
                  {familyMembers.length > 0 && (
                    <div
                      className="d-flex align-items-center justify-content-center mb-2"
                      style={{ color: "#007a7e" }}
                    >
                      <Users className="me-2" size={18} />
                      <span style={{ fontFamily: "Poppins", fontSize: "14px" }}>
                        {isAddMembersMode ? familyMembers.length : 1 + familyMembers.length} {(isAddMembersMode ? familyMembers.length : 1 + familyMembers.length) === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  )}
                  <div
                    className="text-lg opacity-90"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {languagesType[selectedLanguage].validFor}
                  </div>
                  <div
                    className="text-sm mt-2 opacity-80"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {languagesType[selectedLanguage].instantCard}
                  </div>
                </div>
              </Card.Body>
            </Card>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
                marginTop: "15px",
                margin: "15px auto 20px",
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <LogOut className="h-5 w-5" style={{ marginRight: "8px" }} />
              Logout
            </button>
          </Col>

          <Col md={8}>
            <Card className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <Card.Body>
                <h2
                  className="h4 mb-6 secondary-color flex items-center"
                  style={{ fontFamily: "Poppins" }}
                >
                  <MapPin className="h-6 w-6 text-blue-500 me-2" />{" "}
                  {isAddMembersMode
                    ? (languagesType[selectedLanguage].familyMembers?.addMembersTitle || "Add Family Members")
                    : languagesType[selectedLanguage].personalDetails}
                </h2>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  {/* Personal Details - Hidden in add-members mode */}
                  {!isAddMembersMode && (
                    <>
                      {/* Photo Upload Section */}
                      <Row>
                        <Col md={12}>
                          <Form.Group controlId="formPhoto" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.photo}
                            </Form.Label>
                            <div className="position-relative">
                              {!photoPreview ? (
                                <div className="border rounded d-flex align-items-center justify-content-center p-4 bg-light">
                                  <div className="text-center">
                                    <Upload className="h-8 w-8 text-secondary mx-auto mb-2" />
                                    <p className="mb-2">
                                      {
                                        languagesType[selectedLanguage].form
                                          .uploadPhotoText
                                      }
                                    </p>
                                    <Form.Control
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoChange}
                                      className="d-none"
                                      id="photo-upload"
                                    />
                                    <label
                                      htmlFor="photo-upload"
                                      className="btn btn-sm"
                                      style={{
                                        backgroundColor: "#3399cc",
                                        color: "white",
                                        border: "none",
                                        padding: "0.375rem 0.75rem",
                                        fontSize: "0.875rem",
                                        lineHeight: "1.5",
                                        borderRadius: "0.25rem",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {
                                        languagesType[selectedLanguage].form
                                          .chooseFile
                                      }
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div className="position-relative">
                                  <Image
                                    src={photoPreview}
                                    alt="Preview"
                                    rounded
                                    className="img-thumbnail"
                                    style={{ maxHeight: "200px" }}
                                  />
                                  <button
                                    type="button"
                                    className="position-absolute top-0 end-0 bg-danger text-white rounded-circle p-1 border border-white"
                                    onClick={handleRemovePhoto}
                                    style={{ transform: "translate(50%, -50%)" }}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                              <Form.Control.Feedback
                                type="invalid"
                                className="d-block"
                              >
                                {errors.photo}
                              </Form.Control.Feedback>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Rest of the form fields remain unchanged */}
                      <Row>
                        <Col md={12}>
                          <Form.Group controlId="formFullName" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.full_name} *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleInputChange}
                              isInvalid={!!errors.full_name}
                              placeholder={
                                languagesType[selectedLanguage].form.placeholders
                                  .full_name
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.full_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group controlId="formAge" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.age} *
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={(e) => handleNumberChange(e, "age")}
                              isInvalid={!!errors.age}
                              placeholder={
                                languagesType[selectedLanguage].form.placeholders
                                  .age
                              }
                              min="1"
                              max="120"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.age}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group controlId="formGender" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.gender} *
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              isInvalid={!!errors.gender}
                            >
                              <option value="">
                                {languagesType[selectedLanguage].form.selectGender}
                              </option>
                              <option value="Male">
                                {languagesType[selectedLanguage].form.male}
                              </option>
                              <option value="Female">
                                {languagesType[selectedLanguage].form.female}
                              </option>
                              <option value="Other">
                                {languagesType[selectedLanguage].form.other}
                              </option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.gender}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group controlId="formBloodGroup" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.blood_group}
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="blood_group"
                              value={formData.blood_group}
                              onChange={handleInputChange}
                              isInvalid={!!errors.blood_group}
                            >
                              <option value="">
                                {languagesType[selectedLanguage].form
                                  .selectBloodGroup || "Select Blood Group"}
                              </option>
                              {BLOOD_GROUPS.map((bg, idx) => (
                                <option key={bg + idx} value={bg}>
                                  {bg}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.blood_group}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={8}>
                          <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.address} *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              isInvalid={!!errors.address}
                              placeholder={
                                languagesType[selectedLanguage].form.placeholders
                                  .address
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.address}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId="formPinCode" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.pin_code} *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="pin_code"
                              value={formData.pin_code}
                              onChange={(e) => handleNumberChange(e, "pin_code")}
                              isInvalid={!!errors.pin_code}
                              placeholder={
                                languagesType[selectedLanguage].form.placeholders
                                  .pin_code
                              }
                              maxLength="6"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pin_code}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Form.Group controlId="formMobileNumber" className="mb-3">
                            <Form.Label>
                              {languagesType[selectedLanguage].form.mobile_number} *
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="mobile_number"
                              value={formData.mobile}
                              readOnly
                              onChange={(e) =>
                                handleNumberChange(e, "mobile_number")
                              }
                              isInvalid={!!errors.mobile_number}
                              placeholder={
                                languagesType[selectedLanguage].form.placeholders
                                  .mobile_number
                              }
                              maxLength="10"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobile_number}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Family Members Section */}
                  <div className="mt-4 mb-4" style={{
                    background: "linear-gradient(135deg, #f8fffe 0%, #f0f9f7 100%)",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e0f2ef"
                  }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div style={{
                          background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
                          borderRadius: "10px",
                          padding: "10px",
                          marginRight: "12px"
                        }}>
                          <Users className="text-white" size={22} />
                        </div>
                        <div>
                          <h5 className="mb-0" style={{ fontFamily: "Poppins", color: "#095D7E", fontWeight: "600" }}>
                            {languagesType[selectedLanguage].familyMembers?.title || "Add Family Members"}
                          </h5>
                          <small className="text-muted">
                            {languagesType[selectedLanguage].familyMembers?.addMemberHint || "Add family members to include them in your membership"}
                          </small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn d-flex align-items-center"
                        onClick={addFamilyMember}
                        style={{
                          background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 16px",
                          fontWeight: "500",
                          boxShadow: "0 2px 8px rgba(0,122,126,0.3)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <UserPlus size={18} className="me-2" />
                        {languagesType[selectedLanguage].familyMembers?.addButton || "Add Member"}
                      </button>
                    </div>

                    {/* Existing member note for add-members mode */}
                    {isAddMembersMode && (
                      <div className="alert alert-info d-flex align-items-center mb-3" role="alert" style={{
                        backgroundColor: "#e7f5ff",
                        border: "1px solid #74c0fc",
                        borderRadius: "8px"
                      }}>
                        <Users size={18} className="me-2 text-primary" />
                        {languagesType[selectedLanguage].familyMembers?.existingMemberNote || "You are adding family members to your existing membership"}
                      </div>
                    )}

                    {errors.familyMembers && (
                      <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ borderRadius: "8px" }}>
                        <span className="me-2">⚠️</span>
                        {errors.familyMembers}
                      </div>
                    )}

                    {/* Empty State */}
                    {familyMembers.length === 0 && (
                      <div className="text-center py-4" style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "2px dashed #d0e8e5"
                      }}>
                        <div style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          backgroundColor: "#e0f2ef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 15px"
                        }}>
                          <Users size={28} style={{ color: "#007a7e" }} />
                        </div>
                        <h6 style={{ color: "#095D7E", fontFamily: "Poppins" }}>
                          {languagesType[selectedLanguage].familyMembers?.noMembers || "No family members added yet"}
                        </h6>
                        <p className="text-muted small mb-0">
                          {languagesType[selectedLanguage].familyMembers?.addMemberHint || "Add family members to include them in your membership"}
                        </p>
                      </div>
                    )}

                    {familyMembers.map((member, index) => (
                      <Card key={member.id} className="mb-3" style={{
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        transition: "all 0.2s ease"
                      }}>
                        <div style={{
                          background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
                          padding: "12px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <h6 className="mb-0 text-white" style={{ fontFamily: "Poppins", fontWeight: "500" }}>
                            {languagesType[selectedLanguage].familyMembers?.memberLabel || "Family Member"} {index + 1}
                          </h6>
                          <button
                            type="button"
                            className="btn btn-sm d-flex align-items-center"
                            onClick={() => removeFamilyMember(member.id)}
                            style={{
                              backgroundColor: "rgba(255,255,255,0.2)",
                              border: "none",
                              color: "white",
                              borderRadius: "6px",
                              padding: "5px 10px"
                            }}
                          >
                            <Trash2 size={14} className="me-1" />
                            {languagesType[selectedLanguage].familyMembers?.removeMember || "Remove"}
                          </button>
                        </div>
                        <Card.Body style={{ padding: "20px" }}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                                  {languagesType[selectedLanguage].form?.full_name || "Full Name"} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  value={member.full_name}
                                  onChange={(e) => updateFamilyMember(member.id, "full_name", e.target.value)}
                                  isInvalid={!!errors[`member_${member.id}_full_name`]}
                                  placeholder={languagesType[selectedLanguage].form?.placeholders?.full_name || "Enter full name"}
                                  style={{ borderRadius: "8px", padding: "10px 14px" }}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors[`member_${member.id}_full_name`]}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                                  {languagesType[selectedLanguage].form?.age || "Age"} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={member.age}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^[0-9]*$/.test(val) && val.length <= 3) {
                                      updateFamilyMember(member.id, "age", val);
                                    }
                                  }}
                                  isInvalid={!!errors[`member_${member.id}_age`]}
                                  placeholder={languagesType[selectedLanguage].form?.placeholders?.age || "Age"}
                                  min="1"
                                  max="120"
                                  style={{ borderRadius: "8px", padding: "10px 14px" }}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors[`member_${member.id}_age`]}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                                  {languagesType[selectedLanguage].form?.gender || "Gender"} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as="select"
                                  value={member.gender}
                                  onChange={(e) => updateFamilyMember(member.id, "gender", e.target.value)}
                                  isInvalid={!!errors[`member_${member.id}_gender`]}
                                  style={{ borderRadius: "8px", padding: "10px 14px" }}
                                >
                                  <option value="">{languagesType[selectedLanguage].form?.selectGender || "Select"}</option>
                                  <option value="Male">{languagesType[selectedLanguage].form?.male || "Male"}</option>
                                  <option value="Female">{languagesType[selectedLanguage].form?.female || "Female"}</option>
                                  <option value="Other">{languagesType[selectedLanguage].form?.other || "Other"}</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                  {errors[`member_${member.id}_gender`]}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                                  {languagesType[selectedLanguage].familyMembers?.relationship || "Relationship"} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as="select"
                                  value={member.relationship}
                                  onChange={(e) => updateFamilyMember(member.id, "relationship", e.target.value)}
                                  isInvalid={!!errors[`member_${member.id}_relationship`]}
                                  style={{ borderRadius: "8px", padding: "10px 14px" }}
                                >
                                  <option value="">{languagesType[selectedLanguage].familyMembers?.selectRelationship || "Select Relationship"}</option>
                                  {RELATIONSHIP_CHOICES.map((rel) => (
                                    <option key={rel.value} value={rel.value}>
                                      {languagesType[selectedLanguage].familyMembers?.relationships?.[rel.value] || rel.label}
                                    </option>
                                  ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                  {errors[`member_${member.id}_relationship`]}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                                  {languagesType[selectedLanguage].form?.blood_group || "Blood Group"} <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                  as="select"
                                  value={member.blood_group}
                                  onChange={(e) => updateFamilyMember(member.id, "blood_group", e.target.value)}
                                  isInvalid={!!errors[`member_${member.id}_blood_group`]}
                                  style={{ borderRadius: "8px", padding: "10px 14px" }}
                                >
                                  <option value="">Select Blood Group</option>
                                  {BLOOD_GROUPS.map((bg) => (
                                    <option key={bg} value={bg}>
                                      {bg}
                                    </option>
                                  ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                  {errors[`member_${member.id}_blood_group`]}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
                              <Form.Group className="mb-0 text-center">
                                <Form.Label style={{ fontWeight: "600", color: "#333", marginBottom: "12px", display: "block" }}>
                                  {languagesType[selectedLanguage].familyMembers?.memberPhoto || "Member Photo"} <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="member-photo-avatar-wrapper" style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto" }}>
                                  {!member.imagePreview ? (
                                    <div className="w-100 h-100">
                                      <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleMemberPhotoChange(member.id, e)}
                                        className="d-none"
                                        isInvalid={!!errors[`member_${member.id}_photo`]}
                                        id={`member-photo-${member.id}`}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => triggerFileInput(member.id)}
                                        className="btn p-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                        style={{
                                          backgroundColor: "#f0f7f7",
                                          border: errors[`member_${member.id}_photo`] ? "2px dashed #dc3545" : "2px dashed #007a7e",
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                          position: "relative",
                                          overflow: "hidden"
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = "#e0f2ef";
                                          e.currentTarget.style.transform = "scale(1.05)";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = "#f0f7f7";
                                          e.currentTarget.style.transform = "scale(1)";
                                        }}
                                      >
                                        <User size={48} style={{ color: errors[`member_${member.id}_photo`] ? "#dc3545" : "#007a7e", opacity: 0.5 }} />
                                        <div style={{
                                          position: "absolute",
                                          bottom: "0",
                                          width: "100%",
                                          backgroundColor: "rgba(0, 122, 126, 0.8)",
                                          padding: "4px 0",
                                          color: "white",
                                          fontSize: "10px",
                                          fontWeight: "600"
                                        }}>
                                          ADD PHOTO
                                        </div>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-100 h-100 position-relative group" style={{ borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "3px solid white" }}>
                                      <Image
                                        src={member.imagePreview}
                                        alt="Member Preview"
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover"
                                        }}
                                      />
                                      <div
                                        className="photo-overlay"
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          left: 0,
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: "rgba(0,0,0,0.4)",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          opacity: 0,
                                          transition: "opacity 0.2s ease",
                                          cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                                        onClick={() => triggerFileInput(member.id)}
                                      >
                                        <Camera size={24} color="white" className="mb-1" />
                                        <span style={{ color: "white", fontSize: "10px", fontWeight: "600" }}>CHANGE</span>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm shadow-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeMemberPhoto(member.id);
                                        }}
                                        style={{
                                          position: "absolute",
                                          bottom: "5px",
                                          right: "5px",
                                          width: "28px",
                                          height: "28px",
                                          borderRadius: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          padding: 0,
                                          border: "2px solid white",
                                          zIndex: 2
                                        }}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                      <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleMemberPhotoChange(member.id, e)}
                                        className="d-none"
                                        id={`member-photo-${member.id}`}
                                      />
                                    </div>
                                  )}
                                </div>
                                {errors[`member_${member.id}_photo`] && (
                                  <div className="text-danger small mt-2 fw-500">
                                    {errors[`member_${member.id}_photo`]}
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}

                    {/* Pricing Summary Card */}
                    {(getSubscriptionCount() > 0) && (
                      <Card className="mt-3" style={{
                        background: "linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%)",
                        border: "1px solid #ffd966",
                        borderRadius: "12px"
                      }}>
                        <Card.Body className="py-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1" style={{ fontFamily: "Poppins", color: "#856404" }}>
                                {languagesType[selectedLanguage].familyMembers?.pricingSummary || "Membership Summary"}
                              </h6>
                              <small className="text-muted">
                                {languagesType[selectedLanguage].familyMembers?.totalMembers || "Total Members"}:
                                <strong className="ms-1">{getSubscriptionCount()}</strong>
                                {!isAddMembersMode && " (You + " + familyMembers.length + " family)"}
                                {isAddMembersMode && " (" + familyMembers.length + " new members)"}
                              </small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">
                                {languagesType[selectedLanguage].familyMembers?.pricePerMember || "Price per Member"}: ₹{MEMBERSHIP_PRICE}
                              </small>
                              <h4 className="mb-0" style={{ color: "#095D7E", fontWeight: "700" }}>
                                ₹{getTotalPrice()}
                              </h4>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 py-3 mt-4 buy-membership-btn"
                    style={{
                      background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "600",
                      fontFamily: "Poppins",
                      boxShadow: "0 4px 15px rgba(0,122,126,0.3)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isSubmitting
                      ? languagesType[selectedLanguage].processing
                      : `${languagesType[selectedLanguage].payNow} - ₹${getTotalPrice()}`}
                  </button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h2 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <Shield className="h-6 w-6 me-2" />{" "}
                  {languagesType[selectedLanguage].termsConditions}
                </h2>
                <ul className="list-unstyled">
                  {termsConditions.map((term, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-start mb-2"
                      style={{ fontFamily: "Poppins" }}
                    >
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="ms-4" style={{ fontFamily: "Poppins" }}>
                        {term}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: "#095D7E",
              }}
            >
              Confirm Logout
            </h3>
            <p>Are you sure you want to logout?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#dc3545",
                  color: "white",
                }}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#095D7E",
              }}
            >
              Welcome to VaidyaBandhu Family
            </h3>
            <p style={{ marginBottom: "25px", fontSize: "16px" }}>
              The complete healthcare solution.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#007a7e",
                  color: "white",
                  fontSize: "16px",
                }}
                onClick={() => {
                  setShowWelcomeModal(false);
                  navigate("/myprofile");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      <Modal show={cropModalOpen} onHide={() => setCropModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crop Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '500px', maxWidth: '100%' }}
                />
              </ReactCrop>
            )}
          </div>
          <canvas
            ref={previewCanvasRef}
            style={{ display: 'none' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn"
            onClick={() => setCropModalOpen(false)}
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              color: "#6c757d",
              padding: "8px 20px",
              borderRadius: "8px",
              fontWeight: "500",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e9ecef";
              e.currentTarget.style.borderColor = "#ced4da";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
              e.currentTarget.style.borderColor = "#dee2e6";
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={handleCropSave}
            disabled={!completedCrop?.width || !completedCrop?.height}
            style={{
              background: "linear-gradient(135deg, #007a7e 0%, #095D7E 100%)",
              color: "white",
              border: "none",
              padding: "8px 25px",
              borderRadius: "8px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0, 122, 126, 0.2)",
              transition: "all 0.3s ease",
              opacity: (!completedCrop?.width || !completedCrop?.height) ? 0.65 : 1
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(153, 193, 195, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(252, 252, 252, 1)";
            }}
          >
            Upload Photo
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VaidyaBandhuForm;


