import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../../axios';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';

const isPending = (acc) => acc.picture === "0" || acc.latitude === "0" || acc.longitude === "0";
const isValidated = (acc) => acc.picture !== "0" && acc.latitude !== "0" && acc.longitude !== "0";

function ValidateAccountModal({ account, onClose, onValidated, allBusinessHubs }) {
  const [picture, setPicture] = useState(null);
  const [latitude, setLatitude] = useState(account.latitude);
  const [longitude, setLongitude] = useState(account.longitude);
  const [submitting, setSubmitting] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [dssList, setDssList] = useState([]);
  const [selectedDss, setSelectedDss] = useState('');
  const [tariffList, setTariffList] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState('');
  const [regionForHub, setRegionForHub] = useState(account.region);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState('');
  
  // New state for editable region and business hub
  const [allRegions, setAllRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(account.region);
  const [businessHubsForRegion, setBusinessHubsForRegion] = useState([]);
  const [selectedBusinessHub, setSelectedBusinessHub] = useState(account.business_hub);
  
  const webcamRef = useRef(null);

  // Pre-select values if available in account
  useEffect(() => {
    if (account.service_center) {
      setSelectedServiceCenter(account.service_center);
    }
    if (account.region) {
      setSelectedRegion(account.region);
    }
    if (account.business_hub) {
      setSelectedBusinessHub(account.business_hub);
    }
  }, [account.service_center, account.region, account.business_hub]);

  // Extract regions from business hubs data
  useEffect(() => {
    if (allBusinessHubs.length > 0) {
      const regions = [...new Set(allBusinessHubs.map(hub => 
        hub.Region ? hub.Region.replace(/region/i, '').trim() : ''
      ).filter(region => region))];
      setAllRegions(regions);
    }
  }, [allBusinessHubs]);

  // Filter business hubs when region changes
  useEffect(() => {
    if (!selectedRegion || allBusinessHubs.length === 0) return;
    const filteredHubs = allBusinessHubs.filter(hub => 
      hub.Region && hub.Region.replace(/region/i, '').trim().toLowerCase() === selectedRegion.toLowerCase()
    );
    setBusinessHubsForRegion(filteredHubs.map(hub => hub.Business_Hub));
    // Only reset if the current business hub is not in the new filtered list
    if (selectedBusinessHub && !filteredHubs.some(hub => hub.Business_Hub === selectedBusinessHub)) {
      setSelectedBusinessHub('');
      setSelectedServiceCenter('');
    }
  }, [selectedRegion, allBusinessHubs, selectedBusinessHub]);

  useEffect(() => {
    if (allBusinessHubs.length > 0 && selectedBusinessHub) {
      const found = allBusinessHubs.find(
        hub => hub.Business_Hub.trim().toLowerCase() === selectedBusinessHub.trim().toLowerCase()
      );
      if (found) {
        const cleanRegion = (found.Region || selectedRegion || '').replace(/region/i, '').trim();
        setRegionForHub(cleanRegion);
      }
    }
  }, [allBusinessHubs, selectedBusinessHub, selectedRegion]);

  // Fetch DSS when business hub and service center are selected
  useEffect(() => {
    if (!selectedBusinessHub || !selectedServiceCenter) return;
    const fetchDss = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/get_dss?region=${encodeURIComponent(selectedRegion)}&hub=${encodeURIComponent(selectedBusinessHub)}&service_center=${encodeURIComponent(selectedServiceCenter)}`;
        const res = await axiosClient.get(url);
        setDssList(res.data.payload.dss || []);
      } catch (e) {
        setDssList([]);
      }
    };
    fetchDss();
  }, [selectedBusinessHub, selectedServiceCenter, selectedRegion]);

  // Fetch Tariff independently
  useEffect(() => {
    const fetchTariff = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/get_tarriff');
        setTariffList(res.data.payload.tarriff || []);
      } catch (e) {
        setTariffList([]);
      }
    };
    fetchTariff();
  }, []);

  useEffect(() => {
    if (!selectedBusinessHub) return;
    const fetchServiceCenters = async () => {
      try {
        const url = `/V4IBEDC_new_account_setup_sync/initiate/service_centers/${encodeURIComponent(selectedBusinessHub)}`;
        const res = await axiosClient.get(url);
        setServiceCenters(res.data.payload.service_center || []);
        // Only reset service center if current one is not in the new list
        if (selectedServiceCenter && !res.data.payload.service_center?.some(sc => sc.DSS_11KV_415V_Owner === selectedServiceCenter)) {
          setSelectedServiceCenter('');
        }
      } catch (e) {
        setServiceCenters([]);
      }
    };
    fetchServiceCenters();
  }, [selectedBusinessHub, selectedServiceCenter]);

  const handleCapturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPicture(imageSrc);
      setCaptured(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
          },
          (err) => alert('Location error: ' + err.message)
        );
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const code = account.email;
    const formData = new FormData();
    formData.append('tracking_id', account.tracking_id);
    if (picture) {
      const res = await fetch(picture);
      const blob = await res.blob();
      formData.append('picture', blob, 'capture.jpg');
    }
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('region', selectedRegion);
    formData.append('business_hub', selectedBusinessHub);
    formData.append('service_center', selectedServiceCenter);
    formData.append('dss', selectedDss);
    formData.append('id', account.id);
    formData.append('tarrif', selectedTariff);
    formData.append('code', code);
    formData.append('email', account.account.email);
    try {
      await axiosClient.post('/V4IBEDC_new_account_setup_sync/initiate/process_account_dte', formData);
      toast.success('Account validated!');
      if (typeof onValidated === 'function') onValidated();
      if (typeof onClose === 'function') onClose();
    } catch (e) {
      toast.error('Validation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
        <h2 className="font-bold mb-4">Validate Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div>
            <div className="mb-2">Tracking ID: <span className="font-mono">{account.tracking_id}</span></div>
            <div className="mb-2">
              <label>Region:</label>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="block w-full border rounded p-1"
                required
              >
                <option value="">Select Region</option>
                {allRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Business Hub:</label>
              <select
                value={selectedBusinessHub}
                onChange={e => setSelectedBusinessHub(e.target.value)}
                className="block w-full border rounded p-1"
                required
                disabled={businessHubsForRegion.length === 0}
              >
                <option value="">Select Business Hub</option>
                {businessHubsForRegion.map(hub => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Service Center:</label>
              <select
                value={selectedServiceCenter}
                onChange={e => setSelectedServiceCenter(e.target.value)}
                className="block w-full border rounded p-1"
                required
                disabled={serviceCenters.length === 0}
              >
                <option value="">Select Service Center</option>
                {serviceCenters.map(sc => (
                  <option key={sc.DSS_11KV_415V_Owner} value={sc.DSS_11KV_415V_Owner}>{sc.DSS_11KV_415V_Owner}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>DSS:</label>
              <select
                value={selectedDss}
                onChange={e => setSelectedDss(e.target.value)}
                className="block w-full border rounded p-1"
                required
              >
                <option value="">Select DSS</option>
                {dssList.map(dss => (
                  <option key={dss.Assetid} value={dss.Assetid}>
                    {dss.DSS_11KV_415V_Name} ({dss.DSS_11KV_415V_Address})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Tariff:</label>
              <select
                value={selectedTariff}
                onChange={e => setSelectedTariff(e.target.value)}
                className="block w-full border rounded p-1"
                required
              >
                <option value="">Select Tariff</option>
                {tariffList.map(tariff => (
                  <option key={tariff.TariffID} value={tariff.TariffID}>
                    {tariff.Description}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">Email: {account.account.email}</div>
            <div className="mb-2">ID: {account.id}</div>
          </div>
          {/* Column 2 */}
          <div>
            <div className="mb-2">
              <label>Picture (real-time capture):</label>
              {!captured ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={320}
                    height={240}
                    videoConstraints={{ facingMode: 'environment' }}
                    className="rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Capture Building
                  </button>
                </>
              ) : (
                <div className="mb-2">
                  <img
                    src={picture}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => { setCaptured(false); setPicture(null); }}
                    className="bg-gray-400 text-white px-2 py-1 rounded mt-2 ml-2"
                  >
                    Retake
                  </button>
                </div>
              )}
            </div>
            <div className="mb-2">Latitude: {latitude}</div>
            <div className="mb-2">Longitude: {longitude}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {/* Debug info */}
          <div className="text-xs text-gray-500 mr-auto">
            Debug: Picture: {picture ? '✓' : '✗'}, Lat: {latitude ? '✓' : '✗'}, Lng: {longitude ? '✓' : '✗'}, 
            DSS: {selectedDss ? '✓' : '✗'}, Tariff: {selectedTariff ? '✓' : '✗'}, 
            SC: {selectedServiceCenter ? '✓' : '✗'}, Region: {selectedRegion ? '✓' : '✗'}, 
            BH: {selectedBusinessHub ? '✓' : '✗'}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || !picture || !latitude || !longitude || !selectedDss || !selectedTariff || !selectedServiceCenter || !selectedRegion || !selectedBusinessHub}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={typeof onClose === 'function' ? onClose : undefined}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DTEValidation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accounts = [], trackingId } = location.state || {};

  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);
  
  // Add allBusinessHubs state for region derivation
  const [allBusinessHubs, setAllBusinessHubs] = useState([]);

  // Fetch all business hubs for region derivation
  useEffect(() => {
    const fetchAllBusinessHubs = async () => {
      try {
        const res = await axiosClient.get('/V4IBEDC_new_account_setup_sync/initiate/all_business_hub');
        setAllBusinessHubs(res.data.payload.business_hubs || []);
      } catch (e) {
        setAllBusinessHubs([]);
      }
    };
    fetchAllBusinessHubs();
  }, []);

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">No applications found for this Tracking ID.</h2>
        <button
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
          <h2 className="text-2xl font-bold text-blue-700">Applications for Tracking ID: {trackingId}</h2>
          <div className="w-24"></div> {/* Spacer to center the title */}
        </div>
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">House No</th>
              <th className="p-2 border">Full Address</th>
              <th className="p-2 border">Business Hub</th>
              <th className="p-2 border">Service Center</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, idx) => (
              <tr key={acc.id || idx} className="text-center">
                <td className="p-2 border">{acc.house_no}</td>
                <td className="p-2 border">{acc.full_address}</td>
                <td className="p-2 border">{acc.business_hub}</td>
                <td className="p-2 border">{acc.service_center}</td>
                <td className="p-2 border">{acc.account?.status_name || acc.status}</td>
                <td className="flex flex-row justify-center items-center gap-8 p-2 border space-x-2">
                  {isPending(acc) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-xs"
                      onClick={() => { setSelectedAccount(acc); setValidateModalOpen(true); }}
                    >
                      Validate
                    </button>
                  )}
                  {isValidated(acc) && <span className="text-green-600 font-semibold">Validated</span>}
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => { setViewAccount(acc); setViewModalOpen(true); }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {validateModalOpen && selectedAccount && (
          <ValidateAccountModal
            account={selectedAccount}
            onClose={() => setValidateModalOpen(false)}
            onValidated={() => {
              setValidateModalOpen(false);
              // Optionally refresh or update the accounts list here
            }}
            allBusinessHubs={allBusinessHubs}
          />
        )}
        {viewModalOpen && viewAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="font-bold mb-4 text-lg">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2"><strong>Tracking ID:</strong> {viewAccount.tracking_id}</div>
                  <div className="mb-2"><strong>Region:</strong> {(() => {
                    // Try to get region from viewAccount.region first, if null, derive from business hub
                    if (viewAccount.region) {
                      return viewAccount.region;
                    }
                    // Find the business hub in allBusinessHubs to get its region
                    if (allBusinessHubs.length > 0 && viewAccount.business_hub) {
                      const found = allBusinessHubs.find(
                        hub => hub.Business_Hub.trim().toLowerCase() === viewAccount.business_hub.trim().toLowerCase()
                      );
                      if (found && found.Region) {
                        return found.Region.replace(/region/i, '').trim();
                      }
                    }
                    return 'Not specified';
                  })()}</div>
                  <div className="mb-2"><strong>State:</strong> {viewAccount.state}</div>
                  <div className="mb-2"><strong>Business Hub:</strong> {viewAccount.business_hub}</div>
                  <div className="mb-2"><strong>Service Center:</strong> {viewAccount.service_center}</div>
                  <div className="mb-2"><strong>DSS:</strong> {viewAccount.dss}</div>
                  <div className="mb-2"><strong>House No:</strong> {viewAccount.house_no}</div>
                  <div className="mb-2"><strong>Full Address:</strong> {viewAccount.full_address}</div>
                  <div className="mb-2"><strong>Nearest Bus Stop:</strong> {viewAccount.nearest_bustop}</div>
                  <div className="mb-2"><strong>LGA:</strong> {viewAccount.lga}</div>
                  <div className="mb-2"><strong>Landmark:</strong> {viewAccount.landmark}</div>
                  <div className="mb-2"><strong>Type of Premise:</strong> {viewAccount.type_of_premise}</div>
                  <div className="mb-2"><strong>Use of Premise:</strong> {viewAccount.use_of_premise}</div>
                  <div className="mb-2"><strong>Account:</strong> {viewAccount.account?.surname} {viewAccount.account?.firstname} {viewAccount.account?.other_name}</div>
                  <div className="mb-2"><strong>Phone:</strong> {viewAccount.account?.phone}</div>
                  <div className="mb-2"><strong>Email:</strong> {viewAccount.account?.email}</div>
                </div>
                <div>
                  <div className="mb-2"><strong>Picture:</strong><br/>
                    {viewAccount.picture && (
                      <img src={`https://ipay.ibedc.com:7642/storage/${viewAccount.picture}`} alt="Account" className="w-40 h-40 object-cover rounded border mb-2" />
                    )}
                  </div>
                  <div className="mb-2"><strong>LECAN Link:</strong><br/>
                    {viewAccount.lecan_link && (
                      <a href={`https://ipay.ibedc.com:7642/storage/${viewAccount.lecan_link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View LECAN Document</a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setViewModalOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 