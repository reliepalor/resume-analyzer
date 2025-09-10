export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
    // Set the worker source to match the library version
    lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    if (file.type !== 'application/pdf') {
      return {
        imageUrl: "",
        file: null,
        error: "File is not a PDF",
      };
    }

    console.log("Loading PDF.js library...");
    const lib = await loadPdfJs();
    console.log("PDF.js loaded successfully");

    console.log("Reading file as array buffer...");
    const arrayBuffer = await file.arrayBuffer();
    console.log("Array buffer loaded, size:", arrayBuffer.byteLength);

    console.log("Loading PDF document...");
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    console.log("PDF loaded, num pages:", pdf.numPages);

    if (pdf.numPages < 1) {
      return {
        imageUrl: "",
        file: null,
        error: "PDF has no pages",
      };
    }

    console.log("Getting first page...");
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 }); // Reduced scale from 4 to 2
    console.log("Viewport:", viewport.width, viewport.height);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to get canvas 2D context",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log("Rendering page to canvas...");
    await page.render({ canvasContext: context, viewport }).promise;
    console.log("Page rendered successfully");

    return new Promise((resolve) => {
      console.log("Converting canvas to blob...");
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Blob created, size:", blob.size);
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("Failed to create blob from canvas");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob from canvas",
            });
          }
        },
        "image/png",
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    console.error("Error in convertPdfToImage:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
