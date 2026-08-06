import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ApiException } from "../../common/http/api-exception.js";

@Injectable()
export class DatabaseReadinessService {
  public constructor(private readonly dataSource: DataSource) {}

  public async assertReady(): Promise<void> {
    try {
      await this.dataSource.query("SELECT 1");
    } catch {
      throw ApiException.serviceUnavailable();
    }
  }
}
