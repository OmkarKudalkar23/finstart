'use client';

interface CubeLoaderProps {
    isLoading?: boolean;
    fullScreen?: boolean;
}

export default function CubeLoader({ isLoading = true, fullScreen = false }: CubeLoaderProps) {
    if (!isLoading) return null;

    return (
        <div
            className={fullScreen ? 'cl-overlay' : 'cl-inline'}
            aria-label="Loading"
            role="status"
        >
            {/* Cube — only 4 visible faces, no backdrop-filter on the cube itself */}
            <div className="cl-scene">
                <div className="cl-cube">
                    <div className="cl-face cl-front" />
                    <div className="cl-face cl-back" />
                    <div className="cl-face cl-left" />
                    <div className="cl-face cl-right" />
                    <div className="cl-face cl-top" />
                    <div className="cl-face cl-bottom" />
                </div>
            </div>

            {/* Glow ring underneath */}
            <div className="cl-glow" aria-hidden="true" />

            {/* Label */}
            <p className="cl-label">
                <span className="cl-dot" style={{ animationDelay: '0ms' }} />
                <span className="cl-dot" style={{ animationDelay: '160ms' }} />
                <span className="cl-dot" style={{ animationDelay: '320ms' }} />
            </p>
        </div>
    );
}
