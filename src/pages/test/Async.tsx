import { useEffect, useState } from "react";
import { z } from "zod";

const DatasetSchema = z.object({
  collectionId: z.string(),
  createdAt: z.string(),
  description: z.string(),
  lastUpdatedAt: z.string(),
  coverageStart: z.string(),
  coverageEnd: z.string(),
  frequency: z.string(), // or z.enum([...])
  sources: z.array(z.string()),
  managedByAgencyName: z.string(),
  childDatasets: z.array(z.string()),
  hello_testing: z.string(),
});

type Dataset = z.infer<typeof DatasetSchema>;

const ApiSchema = z.object({
  data: z.object({
    collections: z.array(DatasetSchema),
  }),
});

const Async = () => {
  const [posts, setPosts] = useState<Dataset[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://api-production.data.gov.sg/v2/public/api/collections"
        );
        const raw = await res.json();
        const parsed = ApiSchema.parse(raw); // throws if shape is wrong
        setPosts(parsed.data.collections);
      } catch (err) {
        console.error("Failed to fetch collections", err);
        setPosts([]);
      }
    })();
  }, []);

  return (
    <div>
      <ul>
        {posts.map((post: Dataset) => (
          <li key={post.collectionId}>{post.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Async;
