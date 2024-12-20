import { DI, Registration } from "@microsoft/fast-element/di.js";
import { TestService, TestServiceImpl } from "../service/test.service";

const { singleton } = Registration;

DI.getOrCreateDOMContainer(document.body).register(
  singleton(TestService, TestServiceImpl)
);
