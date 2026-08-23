'use client';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// ─── Appels aux Cloud Functions — memes fonctions que l'app mobile ───
export const callRequestBooking = (data) => httpsCallable(functions, 'requestBooking')(data);
export const callApproveBooking = (bookingId) => httpsCallable(functions, 'approveBooking')({ bookingId });
export const callRejectBooking = (bookingId, reason) => httpsCallable(functions, 'rejectBooking')({ bookingId, reason });
export const callCancelBooking = (bookingId, reason) => httpsCallable(functions, 'cancelBooking')({ bookingId, reason });
export const callMarkHandover = (bookingId, side, paymentReceived) =>
  httpsCallable(functions, 'markHandover')({ bookingId, side, paymentReceived });
export const callMarkReturn = (bookingId, side) => httpsCallable(functions, 'markReturn')({ bookingId, side });
export const callOpenDispute = (data) => httpsCallable(functions, 'openDispute')(data);
export const callAddReview = (data) => httpsCallable(functions, 'addReview')(data);
export const callSwitchToRenter = () => httpsCallable(functions, 'switchToRenter')({});
export const callSwitchToProvider = () => httpsCallable(functions, 'switchToProvider')({});
export const callSubmitProviderApplication = (data) => httpsCallable(functions, 'submitProviderApplication')(data);
export const callDeleteAccount = () => httpsCallable(functions, 'deleteAccount')({});
export const callToggleVehicleWatch = (vehicleId) => httpsCallable(functions, 'toggleVehicleWatch')({ vehicleId });
export const callCreateVehicle = (data) => httpsCallable(functions, 'createVehicle')(data);
export const callUpdateProviderProfile = (data) => httpsCallable(functions, 'updateProviderProfile')(data);
export const callSetVehicleStatus = (vehicleId, status) => httpsCallable(functions, 'setVehicleStatus')({ vehicleId, status });
export const callDeleteVehicle = (vehicleId) => httpsCallable(functions, 'deleteVehicle')({ vehicleId });
