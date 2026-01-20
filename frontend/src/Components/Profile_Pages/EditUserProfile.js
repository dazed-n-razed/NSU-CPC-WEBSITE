import React, { useContext, useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// NavBar is provided by the app Layout; remove local import
import { UserContext } from "../../contexts/UserContext";
import TopNav from "../TopNav";
const EditUserProfile = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [cvFile, setCvFile] = useState(null);
  const [cvDownloadURL, setCVDownloadURL] = useState("");
  const [pictureDownloadURL, setPictureDownloadURL] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100, shows inline progress
  const [photoUpdated, setPhotoUpdated] = useState(false); // brief success animation
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const {
    userInfo,
    setUserInfo,
    percent,
    appliedJobs,
    setAppliedJobs,
    updateUserInfo,
  } = useContext(UserContext);
  console.log("User Info: ", userInfo);
  function getAppliedJobsCount() {
    let studentId = JSON.parse(localStorage.getItem("userInfo"))?._id;
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/applyjob/countMyJobs?studentId=${studentId}`
      )
      .then((res) => {
        setAppliedJobs(res.data);
      })
      .catch((error) => {
        console.error("Failed to get applied jobs:", error.message);
      });
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteFile = (filePath) => {
    const storage = getStorage(app);
    console.log("File Path: ", filePath);
    const fileRef = ref(storage, filePath);
    deleteObject(fileRef)
      .then(() => {
        console.log("File deleted successfully");
        // Update component state or notify user
      })
      .catch((error) => {
        console.error("Error removing file: ", error);
        // Handle errors here
      });
  };
  const uploadFile = (fileType, fileParam = null) => {
    const storage = getStorage(app);
    const folder = fileType === "image" ? "userpfp" : "userfiles";
    const file = fileParam || (fileType === "image" ? pictureFile : cvFile);
    if (!file) {
      alert("No file provided for upload.");
      return;
    }
    const fileName = new Date().getTime() + (folder === "userpfp" ? file.name : file.name);
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setLoading(true);
    setUploadProgress(0);
    console.log(loading);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("CV Upload is " + progress + "% done");
        setUploadProgress(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("CV Upload is paused");
            break;
          case "running":
            console.log("CV Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the CV upload
            break;
          // Handle other CV upload errors...
          default:
            break;
        }
        setLoading(false);
        setUploadProgress(0);
        setUploadError("Upload failed. See console for details.");
        setTimeout(()=>setUploadError(""), 4000);
      },
      () => {
        if (fileType === "image" && userInfo.picture) {
          // Only attempt delete if stored path looks like a storage path (not a download URL)
          if (!userInfo.picture.startsWith("http") && userInfo.picture !== "") {
            handleDeleteFile(userInfo.picture);
          }
        }
        if (fileType === "cv" && userInfo.CV !== undefined) {
          if (!userInfo.CV.startsWith("http") && userInfo.CV !== "") {
            console.log("CV: ", userInfo.CV);
            handleDeleteFile(userInfo.CV);
          }
        }
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("CV available at", downloadURL);
          if (fileType === "image") {
            const updated = { ...userInfo, picture: downloadURL };
            try {
              // call updateInfo with explicit data so backend persists the URL
              const resp = await updateInfo(updated);
              // updateInfo will update context/localStorage; show success animation
              setPhotoUpdated(true);
              setUploadMessage("Photo uploaded successfully.");
              setTimeout(() => setPhotoUpdated(false), 2500);
              setTimeout(() => setUploadMessage(""), 3500);
            } catch (err) {
              console.error('Failed to persist picture URL to backend', err);
              setUploadError("Failed to save photo to server.");
              setTimeout(()=>setUploadError(""),4000);
            }
            setPictureDownloadURL(downloadURL);
            setUserInfo({ ...userInfo, picture: downloadURL });
          }
          if (fileType === "cv") {
            setCVDownloadURL(downloadURL);
            setUserInfo({ ...userInfo, CV: downloadURL });
          }
        }).finally(()=>{
          setLoading(false);
          setUploadProgress(0);
        });
      }
    );
  };

  const handleCVSubmit = (event) => {
    event.preventDefault();
    if (!cvFile) {
      alert("Please select a CV file.");
      return;
    }
    uploadFile("cv");
  };
  const handlePictureSubmit = (event) => {
    event.preventDefault();
    if (!pictureFile) {
      alert("Please select a picture file.");
      return;
    }
    uploadFile("image", pictureFile);
  };
  const [pictureFile, setPictureFile] = useState(null);
  const handleUpdateInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateInfo();
      setSuccessMessage("Profile updated successfully.");
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to update profile. Check console for details.");
      setSuccessMessage("");
    }
  };
  const updateCV = async (userData) => {
    // console.log("User Data: ", userData);
    try {
      // "http://localhost:5000/users/uploadCV",
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/uploadCV`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating CV:", error);
      throw new Error("Failed to update CV. Please try again.");
    }
  };

  const handleCVUpload = async () => {
    if (cvDownloadURL === "") {
      alert("Please select a CV file and make sure user data is available.");
      return;
    }

    try {
      // eslint-disable-next-line
      const updatedUserData = await updateCV({
        email: JSON.parse(localStorage.getItem("userInfo")).email,
        CV: cvDownloadURL,
      });

      // console.log('CV updated successfully:', updatedUserData);
      alert("CV updated successfully.");
      updateUserInfo(updatedUserData);
    } catch (error) {
      // Handle error, show error message, etc.
      console.error("Failed to update CV:", error.message);
    }
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const changePassword = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo._id) {
      throw new Error("User information not found or invalid.");
    }
    try {
      // eslint-disable-next-line
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/changePassword`,
        {
          email: userInfo.email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );
      // const userData = response.data;
      // console.log("User Data: ", userData);
      alert("Password Changed Successfully");
    } catch (error) {
      console.error("Failed to change password:", error.message);
    }
  };

  // You can use this function to get the percentage of the user's profile completion
  // eslint-disable-next-line
  const getPercentage = async () => {
    try {
      let _email = JSON.parse(localStorage.getItem("userInfo")).email;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/getPercent?email=${_email}`
      );
      return response.data;
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to get percentage:", error.message);
    }
  };

  const updateInfo = async (data = null) => {
    const payload = data || userInfo;
    console.log("Updating user with:", payload);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/update`,
        payload
      );
      // Persist returned user info into context/localStorage
      if (response && response.data) {
        updateUserInfo(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw new Error("Failed to update user info. Please try again.");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    getAppliedJobsCount();
    if (!localStorage.getItem("userInfo")) {
      navigate("/login");
    }
    if (cvDownloadURL !== "") {
      handleCVUpload();
      setCVDownloadURL("");
    }
    // eslint-disable-next-line
  }, [cvDownloadURL]);

  useEffect(() => {
    return () => {
      if (picturePreview) {
        try {
          URL.revokeObjectURL(picturePreview);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [picturePreview]);


  return (
    <div className="main bg-gray-50 flex-grow min-h-screen">
        <UserContext.Provider value={{ userInfo }}>
          <TopNav />
        </UserContext.Provider>

        <div className="max-w-6xl mx-auto p-6">
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left profile card */}
            <aside className="col-span-1 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={picturePreview || userInfo?.picture || "/cpc_home_logo.png"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-teal-400"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <div className="text-white font-semibold">{uploadProgress}%</div>
                    </div>
                  )}
                  {photoUpdated && (
                    <div className="absolute right-0 bottom-0 bg-emerald-500 rounded-full p-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{userInfo?.name}</h2>
                  <p className="text-sm text-gray-500">{userInfo?.email}</p>
                </div>
              </div>
              {uploadMessage && (
                <div className="fixed right-4 top-4 bg-emerald-500 text-white px-4 py-2 rounded shadow">
                  {uploadMessage}
                </div>
              )}
              {uploadError && (
                <div className="fixed right-4 top-4 bg-red-500 text-white px-4 py-2 rounded shadow">
                  {uploadError}
                </div>
              )}

              <div className="mt-6">
                <div className="text-sm text-gray-600">Profile Completion</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percent || 0}%` }} />
                </div>
                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>Applied Jobs</span>
                  <span className="font-medium">{appliedJobs || 0}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <label htmlFor="quickPicture" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md cursor-pointer shadow-sm">
                  Change Photo
                </label>
                <input id="quickPicture" type="file" accept="image/*" capture="environment" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setPictureFile(file);
                  const url = URL.createObjectURL(file);
                  setPicturePreview(url);
                  uploadFile('image', file);
                }} className="hidden" />

                <button onClick={() => handleTabClick('updateInfo')} className="ml-auto px-4 py-2 border rounded-md text-sm">Edit Profile</button>
              </div>
            </aside>

            {/* Right content */}
            <main className="col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { key: 'general', label: 'Overview' },
                    { key: 'updateInfo', label: 'Details' },
                    { key: 'updateCV', label: 'CV' },
                    { key: 'updatePicture', label: 'Photo' },
                    { key: 'changePassword', label: 'Password' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => handleTabClick(tab.key)}
                      className={`px-4 py-2 rounded-full text-sm border ${activeTab === tab.key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div>
                  {activeTab === 'general' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">About</h3>
                      <p className="text-sm text-gray-600">{userInfo?.about || 'No description added.'}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">NSU ID</div>
                          <div className="font-medium mt-1">{userInfo?.nsu_id || '-'}</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">Department</div>
                          <div className="font-medium mt-1">{userInfo?.department || '-'}</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">CGPA</div>
                          <div className="font-medium mt-1">{userInfo?.cgpa || '-'}</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">Credits</div>
                          <div className="font-medium mt-1">{userInfo?.credits || '-'}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'changePassword' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium">Old Password</label>
                          <input value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} type="password" className="mt-1 w-full border rounded-md p-3" placeholder="Old password" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">New Password</label>
                          <input value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} type="password" className="mt-1 w-full border rounded-md p-3" placeholder="New password" />
                        </div>
                        <div className="flex justify-end">
                          <button onClick={changePassword} className="px-4 py-2 bg-emerald-600 text-white rounded-md">Update Password</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'updateCV' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Upload CV</h3>
                      <form onSubmit={handleCVSubmit} className="space-y-4">
                        <input onChange={(e)=>{setCvFile(e.target.files[0])}} type="file" accept=".pdf" className="block" />
                        {cvFile && <div className="text-sm text-gray-600">Selected: {cvFile.name}</div>}
                        <div className="flex justify-end">
                          <button disabled={loading} type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Upload</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'updatePicture' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Update Photo</h3>
                      <form onSubmit={handlePictureSubmit} className="space-y-4">
                        <input onChange={(e)=>{
                          const file = e.target.files[0];
                          if (!file) return;
                          setPictureFile(file);
                          const url = URL.createObjectURL(file);
                          setPicturePreview(url);
                        }} type="file" accept="image/*" capture="environment" />
                        {pictureFile && <div className="text-sm text-gray-600">Selected: {pictureFile.name}</div>}
                        <div className="flex justify-end">
                          <button disabled={loading} type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Upload Photo</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'updateInfo' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Edit Details</h3>
                      <form onSubmit={handleUpdateInfoSubmit} className="space-y-4">
                        {successMessage && <div className="text-green-600">{successMessage}</div>}
                        {errorMessage && <div className="text-red-600">{errorMessage}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input value={userInfo?.name||''} onChange={(e)=>setUserInfo({...userInfo, name: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Phone</label>
                            <input value={userInfo?.phone||''} onChange={(e)=>setUserInfo({...userInfo, phone: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">School</label>
                            <input value={userInfo?.school||''} onChange={(e)=>setUserInfo({...userInfo, school: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Department</label>
                            <input value={userInfo?.department||''} onChange={(e)=>setUserInfo({...userInfo, department: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">CGPA</label>
                            <input value={userInfo?.cgpa||''} onChange={(e)=>setUserInfo({...userInfo, cgpa: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Credits</label>
                            <input value={userInfo?.credits||''} onChange={(e)=>setUserInfo({...userInfo, credits: e.target.value})} className="mt-1 w-full border rounded-md p-3" />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button disabled={loading} type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md">Save Changes</button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
};

export default EditUserProfile;
