import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type CurriculumUploadProps = {
  hasCurriculum: boolean;
  onFileSelected: (file: File) => Promise<void>;
};

export function CurriculumUpload({
  hasCurriculum,
  onFileSelected,
}: CurriculumUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);

    try {
      await onFileSelected(file);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          void handleFileSelected(file);

          event.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={isProcessing}
        onClick={() => inputRef.current?.click()}
      >
        {isProcessing
          ? "Обробка..."
          : hasCurriculum
            ? "Замінити навчальну програму"
            : "Завантажити навчальну програму"}
      </Button>
    </>
  );
}
