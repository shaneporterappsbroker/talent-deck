import { auth, slides_v1 } from "@googleapis/slides";
import { drive_v3 } from "@googleapis/drive";
import { GeneratedResource } from "@/lib/api/models/types";

const SOURCE_PRESENTATION_ID = "1mf5cCvC2Y3jWJK76ubddhDbbtJVEcuy3hrk6Z1VzhVA";
const TEMPLATE_SLIDE_ID = "SLIDES_API226386460_0";

interface Clients {
  slidesClient: slides_v1.Slides;
  driveClient: drive_v3.Drive;
}

export type GenerateSlidesResult = {
  webViewLink: string;
  iframeSrc: string;
};

async function withClients(
  accessToken: string | undefined,
  callback: (clients: Clients) => Promise<GenerateSlidesResult>,
) {
  const oauth2Client = new auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const slidesClient = new slides_v1.Slides({ auth: oauth2Client });
  const driveClient = new drive_v3.Drive({ auth: oauth2Client });

  return callback({ slidesClient, driveClient });
}

export async function generateSlides(
  accessToken: string | undefined,
  resources: GeneratedResource[],
): Promise<GenerateSlidesResult> {
  return withClients(accessToken, async ({ slidesClient, driveClient }) => {
    const newPresentationId = await (async () => {
      const res = await driveClient.files.copy({
        fileId: SOURCE_PRESENTATION_ID,
        requestBody: {
          name: `Generated Developer Slides - ${new Date().toISOString()}`,
        },
        supportsAllDrives: true,
      });
      return res.data.id!;
    })();

    console.log("📄 New presentation ID:", newPresentationId);

    const duplicatedSlideIds: string[] = [];

    const duplicateSlide = async (templateId: string): Promise<string> => {
      const response = await slidesClient.presentations.batchUpdate({
        presentationId: newPresentationId,
        requestBody: {
          requests: [
            {
              duplicateObject: {
                objectId: templateId,
              },
            },
          ],
        },
      });
      return response.data.replies![0].duplicateObject!.objectId!;
    };

    for (let i = 0; i < resources.length; i++) {
      const newSlideId = await duplicateSlide(TEMPLATE_SLIDE_ID);
      duplicatedSlideIds.push(newSlideId);
    }

    await slidesClient.presentations.batchUpdate({
      presentationId: newPresentationId,
      requestBody: {
        requests: [
          {
            deleteObject: {
              objectId: TEMPLATE_SLIDE_ID,
            },
          },
        ],
      },
    });
    console.log("🗑️ Removed original template slide");

    const getSlide = async (slideId: string) => {
      const presentation = await slidesClient.presentations.get({
        presentationId: newPresentationId,
      });
      const slide = presentation.data.slides?.find(
        (s) => s.objectId === slideId,
      );
      if (!slide) throw new Error(`Slide ${slideId} not found`);
      return slide;
    };

    const findImageByDescription = async (
      slideId: string,
      description: string,
    ) => {
      const slide = await getSlide(slideId);
      return (
        slide.pageElements?.find(
          (e) => e.image && e.description === description,
        )?.objectId ?? null
      );
    };

    const findShapeIdByText = async (slideId: string, text: string) => {
      const slide = await getSlide(slideId);
      for (const element of slide.pageElements || []) {
        const shape = element.shape;
        if (!shape?.text?.textElements) continue;
        for (const te of shape.text.textElements) {
          if (te.textRun?.content?.includes(text)) {
            return element.objectId ?? null;
          }
        }
      }
      return null;
    };

    const replacePlaceholders = async (
      slideId: string,
      resource: GeneratedResource,
    ) => {
      const [imageId, skillsShape, certsShape] = await Promise.all([
        findImageByDescription(slideId, "AVATAR"),
        findShapeIdByText(slideId, "{{tools_and_skills}}"),
        findShapeIdByText(slideId, "{{certifications}}"),
      ]);

      const textReplacements = {
        "{{name}}": resource.name,
        "{{job_title}}": resource.title,
        "{{strapline}}": resource.strapline,
        "{{professional_background}}": resource.professionalBackground,
      };

      const requests: slides_v1.Schema$Request[] = [
        ...Object.entries(textReplacements).map(
          ([placeholder, replacement]) => ({
            replaceAllText: {
              containsText: { text: placeholder, matchCase: true },
              replaceText: replacement,
              pageObjectIds: [slideId],
            },
          }),
        ),
        ...resource.projects.flatMap((project, i) => [
          {
            replaceAllText: {
              containsText: {
                text: `{{project_${i + 1}_name}}`,
                matchCase: true,
              },
              replaceText: project.client,
              pageObjectIds: [slideId],
            },
          },
          {
            replaceAllText: {
              containsText: {
                text: `{{project_${i + 1}_description}}`,
                matchCase: true,
              },
              replaceText: project.description,
              pageObjectIds: [slideId],
            },
          },
        ]),
      ];

      if (skillsShape) {
        requests.push(
          {
            updateTextStyle: {
              objectId: skillsShape,
              textRange: { type: "ALL" },
              style: { fontSize: { magnitude: 8, unit: "PT" } },
              fields: "fontSize",
            },
          },
          {
            deleteText: {
              objectId: skillsShape,
              textRange: { type: "ALL" },
            },
          },
          {
            insertText: {
              objectId: skillsShape,
              insertionIndex: 0,
              text: resource.skills.map((s) => s.name).join("\n"),
            },
          },
          {
            createParagraphBullets: {
              objectId: skillsShape,
              textRange: { type: "ALL" },
              bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
            },
          },
        );
      }

      if (certsShape) {
        requests.push(
          {
            updateTextStyle: {
              objectId: certsShape,
              textRange: { type: "ALL" },
              style: { fontSize: { magnitude: 8, unit: "PT" } },
              fields: "fontSize",
            },
          },
          {
            deleteText: {
              objectId: certsShape,
              textRange: { type: "ALL" },
            },
          },
          {
            insertText: {
              objectId: certsShape,
              insertionIndex: 0,
              text: resource.certifications.join("\n"),
            },
          },
          {
            createParagraphBullets: {
              objectId: certsShape,
              textRange: { type: "ALL" },
              bulletPreset: "BULLET_DISC_CIRCLE_SQUARE",
            },
          },
        );
      }

      if (imageId) {
        requests.push({
          replaceImage: {
            imageObjectId: imageId,
            url: resource.img,
          },
        });
      }

      await slidesClient.presentations.batchUpdate({
        presentationId: newPresentationId,
        requestBody: { requests },
      });

      console.log(`✅ Populated slide for ${resource.name}`);
    };

    for (let i = 0; i < resources.length; i++) {
      await replacePlaceholders(duplicatedSlideIds[i], resources[i]);
    }

    const thumbRes = await driveClient.files.get({
      fileId: newPresentationId,
      fields: "thumbnailLink, webViewLink",
      supportsAllDrives: true,
    });

    return {
      webViewLink: thumbRes.data.webViewLink ?? "",
      iframeSrc: `${(thumbRes.data.webViewLink ?? "").replace("/edit", "/preview")}&start=true&loop=true&autoPlay=true&delayms=5000`,
    };
  });
}
