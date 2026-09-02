import { Router, type IRouter } from "express";
import healthRouter from "./health";
import validateRouter from "./validate";
import titleHooksRouter from "./titleHooks";
import metadataRouter from "./metadata";
import thumbnailConceptsRouter from "./thumbnailConcepts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(validateRouter);
router.use(titleHooksRouter);
router.use(metadataRouter);
router.use(thumbnailConceptsRouter);

export default router;
