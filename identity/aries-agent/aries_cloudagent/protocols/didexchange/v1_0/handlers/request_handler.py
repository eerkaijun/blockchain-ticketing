"""Connection request handler under RFC 23 (DID exchange)."""

from .....messaging.base_handler import BaseHandler, BaseResponder, RequestContext

from ..manager import DIDXManager, DIDXManagerError
from ..messages.request import DIDXRequest
from ..messages.problem_report import ProblemReport


class DIDXRequestHandler(BaseHandler):
    """Handler class for connection request message under RFC 23 (DID exchange)."""

    async def handle(self, context: RequestContext, responder: BaseResponder):
        """
        Handle connection request under RFC 23 (DID exchange).

        Args:
            context: Request context
            responder: Responder callback
        """

        self._logger.debug(f"DIDXRequestHandler called with context {context}")
        assert isinstance(context.message, DIDXRequest)

        mgr = DIDXManager(context)
        try:
            await mgr.receive_request(context.message, context.message_receipt)
        except DIDXManagerError as e:
            self._logger.exception("Error receiving RFC 23 connection request")
            if e.error_code:
                targets = None
                if context.message.did_doc_attach:
                    try:
                        targets = mgr.diddoc_connection_targets(
                            context.message.did_doc_attach,
                            context.message_receipt.recipient_verkey,
                        )
                    except DIDXManagerError:
                        self._logger.exception(
                            "Error parsing DIDDoc for problem report"
                        )
                await responder.send_reply(
                    ProblemReport(problem_code=e.error_code, explain=str(e)),
                    target_list=targets,
                )
