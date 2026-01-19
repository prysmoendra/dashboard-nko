import type { AIPredictionRequest, AIPredictionResponse } from '../types/ai-monitoring.types';

/**
 * AIPredictionService - Integration with Python AI API
 * Handles prediction requests to the ML backend
 * 
 * NOTE: Direct fetch to Python backend, bypassing Next.js proxy
 * CORS must be enabled on the Python backend for this to work
 */
export class AIPredictionService {
    private readonly apiUrl: string;

    constructor() {
        // Direct connection to Python AI API
        this.apiUrl = 'http://127.0.0.1:5001/predict';
    }

    /**
     * Get AI prediction and wisdom message for a performance indicator
     * @param request - Performance data to analyze
     * @returns AI prediction response with status and wisdom message
     */
    async predictPerformance(request: AIPredictionRequest): Promise<AIPredictionResponse> {
        try {
            // Log the payload being sent for debugging
            console.log('🚀 Sending AI Prediction Request to:', this.apiUrl);
            console.log('📦 Payload:', JSON.stringify(request, null, 2));

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            // Log raw response status and headers
            console.log('📡 Response Status:', response.status, response.statusText);
            console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ AI API Error Response:', errorText);
                throw new Error(`AI API returned ${response.status}: ${errorText}`);
            }

            const rawData = await response.json();

            // Log raw Python response for debugging
            console.log('✅ Raw Python Response:', rawData);


            if (!rawData.data) {
                console.error('⚠️ Invalid response: "data" key is missing from Python response.');
                throw new Error('Invalid response format from AI API: "data" key is missing.');
            }

            // Mapping dari struktur Python ke struktur TypeScript
            // Python: { data: { real_status, wisdom, pic, predicted_percent } }
            // TypeScript: { status, wisdom_message, assigned_role, prediction }
            const pythonData = rawData.data;
                    
            // Mengubah status dari "hijau" -> "Hijau" agar sesuai tipe
            const statusFromPython = pythonData.real_status || '';
            const capitalizedStatus = statusFromPython.charAt(0).toUpperCase() + statusFromPython.slice(1);
                    
            const mappedData: AIPredictionResponse = {
                prediction: pythonData.predicted_percent,
                status: capitalizedStatus as 'Merah' | 'Kuning' | 'Hijau',
                wisdom_message: pythonData.wisdom,
                assigned_role: pythonData.pic,
            };

            // Map Python's snake_case response to TypeScript interface
            // Python sends: status_color, wisdom_message, responsible_role, gap, prediction
            // Frontend expects: status, wisdom_message, assigned_role, prediction
            // const mappedData: AIPredictionResponse = {
            //     prediction: rawData.prediction_percent,
            //     status: rawData.real_status,           // status_color → status
            //     wisdom_message: rawData.wisdom, // Keep as is
            //     assigned_role: rawData.data.pic, // responsible_role → assigned_role
            // };

            console.log('🔄 Mapped Response:', mappedData);

            // Validate mapped response structure
            if (!this.isValidPredictionResponse(mappedData)) {
                console.error('⚠️ Invalid mapped response structure:', mappedData);
                console.error('⚠️ Original Python response:', rawData);
                throw new Error('Invalid response format from AI API after mapping');
            }

            return mappedData;
        } catch (error) {
            console.error('💥 Error calling AI prediction API:', error);

            // Network error (server not reachable)
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Tidak dapat terhubung ke AI API. Pastikan server AI berjalan di http://127.0.0.1:5001');
            }

            // CORS error check
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('CORS Error: Pastikan Python backend mengaktifkan CORS untuk http://localhost:3000');
            }

            throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }

    /**
     * Validate mapped AI API response structure
     * Checks the mapped object after snake_case → camelCase conversion
     */
    private isValidPredictionResponse(data: any): data is AIPredictionResponse {
        const isValid = (
            typeof data === 'object' &&
            data !== null &&
            typeof data.prediction === 'number' &&
            typeof data.status === 'string' &&
            ['Merah', 'Kuning', 'Hijau'].includes(data.status) &&
            typeof data.wisdom_message === 'string' &&
            typeof data.assigned_role === 'string'
        );

        if (!isValid) {
            console.error('🔍 Validation Details:', {
                hasObject: typeof data === 'object' && data !== null,
                hasPrediction: typeof data?.prediction === 'number',
                hasStatus: typeof data?.status === 'string',
                statusValue: data?.status,
                isValidStatus: ['Merah', 'Kuning', 'Hijau'].includes(data?.status),
                hasWisdomMessage: typeof data?.wisdom_message === 'string',
                hasAssignedRole: typeof data?.assigned_role === 'string',
            });
        }

        return isValid;
    }
}

// Export singleton
export const aiPredictionService = new AIPredictionService();
